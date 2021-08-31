import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose'
import { DEPLOY_ENV } from 'src/config'
import PrintSpec from 'src/lib/print-spec'
import { EventualResult, Result } from 'src/util/error'
import { downloadUrlToFile } from 'src/util/file'
import * as S3 from 'src/util/s3'
import { postNewOrder, SlackChannel } from 'src/util/slack'
import { Field, ObjectType } from 'type-graphql'
import { OrderEventTrigger, OrderState } from '../util/enums'
import { BaseModel } from './BaseModel'
import { CardVersion } from './CardVersion'
import OrderEvent from './OrderEvent'
import { Ref } from './scalars'
import { Address, OrderPrice } from './subschemas'
import { User } from './User'

// Mapping of current possible state transitions according to our Order Flow State Machine
// https://www.notion.so/nomus/Order-Flow-State-Machine-e44affeb35764cc488ac771fa9e28851
const ALLOWED_STATE_TRANSITIONS: Record<OrderState, Array<OrderState>> = {
  [OrderState.Captured]: [OrderState.Paid, OrderState.Canceled],
  [OrderState.Paid]: [OrderState.Reviewed, OrderState.Canceled],
  [OrderState.Reviewed]: [OrderState.Creating, OrderState.Canceled],
  [OrderState.Creating]: [OrderState.Created],
  [OrderState.Created]: [OrderState.Enroute],
  [OrderState.Enroute]: [OrderState.Fulfilled],
  [OrderState.Fulfilled]: [],
  [OrderState.Canceled]: [],
}

@pre<Order>('save', async function (next) {
  if (this.isNew) {
    let checkDuplicate = true
    let shortId = this.shortId ?? Math.random().toString(36).substring(2, 8).toUpperCase()
    while (checkDuplicate) {
      const order = await Order.mongo.exists({ shortId: shortId })
      if (!order) {
        this.shortId = shortId
        checkDuplicate = false
        break
      }
      shortId = Math.random().toString(36).substring(2, 8).toUpperCase()
    }
    // Creates a new OrderEvent at creation time
    await OrderEvent.mongo.create({
      order: this.id,
      state: OrderState.Captured,
      trigger: OrderEventTrigger.Nomus,
    })
    next()
  }
  next()
})
@index({ shortId: 1 })
@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class Order extends BaseModel({
  prefix: 'ord',
}) {
  static mongo: ReturnModelType<typeof Order>

  @Field()
  createdAt: Date

  // User who ordered the cards
  @prop({ required: true, ref: () => User, type: String })
  @Field(() => User, { nullable: false })
  user: Ref<User>

  // Card Version that was ordered
  @prop({ required: true, ref: () => CardVersion, type: String })
  @Field(() => CardVersion, { nullable: false })
  cardVersion: Ref<CardVersion>

  // Quantity of cards in the order
  @prop({ required: false })
  @Field({ nullable: false })
  quantity: number

  @prop({ _id: false, required: true })
  @Field(() => OrderPrice, { nullable: false })
  price: OrderPrice

  // This correlates with OrderState at server/src/util/enums.ts
  @prop({ enum: OrderState, type: String, required: true })
  @Field((type) => OrderState, { nullable: false })
  state: OrderState

  // Tracking Number for USPS
  @prop({ required: false })
  @Field({ nullable: true })
  trackingNumber: string

  // Stripe PaymentIntent id; may
  @prop({ required: false })
  @Field({ nullable: true })
  paymentIntent: string

  // Stripe CheckoutSession id
  // See https://stripe.com/docs/api/checkout/sessions/object
  @prop({ required: false })
  @Field({ nullable: true })
  checkoutSession: string

  @prop({
    required: false,
    unique: true,
    description: 'ID printed onto a sheet for the print tech to link a user',
  })
  @Field({ nullable: true })
  shortId: string

  @prop({ required: false, description: 'URL pointing to shipping label document' })
  @Field({ nullable: true })
  shippingLabelUrl: string

  @prop({ required: false, description: 'URL pointing to the document to be printed' })
  @Field({ nullable: true })
  printSpecUrl: string

  @prop({ required: false, description: 'The name of the person to ship the order to' })
  @Field({ nullable: true })
  shippingName: string

  @prop({ _id: false, required: false, description: 'Address to ship this order to' })
  @Field(() => Address, { nullable: true })
  shippingAddress: Address

  @prop({ required: false, description: 'Notes about the order' })
  @Field({ nullable: true })
  notes: string

  // Checks if a proposed transition can be accomplished in our state machine
  private isTransitionAllowed(futureState: OrderState): boolean {
    try {
      return ALLOWED_STATE_TRANSITIONS[this.state].includes(futureState)
    } catch (e) {
      return false
    }
  }

  // Public instance method to transition OrderState
  public async transition(
    this: DocumentType<Order>,
    futureState: OrderState,
    trigger = OrderEventTrigger.Nomus
  ): EventualResult<DocumentType<Order>, 'invalid-transition' | 'save-error'> {
    if (this.isTransitionAllowed(futureState)) {
      try {
        await OrderEvent.mongo.create({
          order: this.id,
          trigger,
          state: futureState,
        })
        this.state = futureState
        await this.save()
      } catch (e) {
        return Result.fail('save-error')
      }
      if (DEPLOY_ENV === 'production') {
        try {
          postNewOrder(SlackChannel.Orders, this)
        } catch (e) {
          console.error(e)
        }
      }
      return Result.ok(this)
    }
    return Result.fail('invalid-transition')
  }

  public async updatePrintSpecPDF(this: DocumentType<Order>) {
    const cardVersion = await CardVersion.mongo.findOne({ _id: this.cardVersion as string })
    // If cardversion is incomplete, do not update print spec
    if (!(cardVersion.frontImageUrl && cardVersion.backImageUrl)) {
      return
    }

    // Use the same filename from the URL so that the extension (e.g. `.png`) persists.
    // PDFKit will complain if the extension isn't present.
    const frontImageFilename = `${cardVersion.frontImageUrl.split('/').slice(-1)[0]}`
    const backImageFilename = `${cardVersion.backImageUrl.split('/').slice(-1)[0]}`
    const frontImageLocalFilePath = await downloadUrlToFile(
      cardVersion.frontImageUrl,
      frontImageFilename,
      'card-images'
    )
    const backImageLocalFilePath = await downloadUrlToFile(
      cardVersion.backImageUrl,
      backImageFilename,
      'card-images'
    )

    const printSpec = new PrintSpec({
      frontImageLocalFilePath,
      backImageLocalFilePath,
      shortId: this.shortId,
    })

    const printSpecFilePath = await printSpec.generatePDF({
      numSheets: this.quantity / 25,
    })

    // Upload print spec PDF to S3
    const printSpecUploadResult = await S3.uploadFileToS3(
      printSpecFilePath,
      // Grab the name from the end of the filepath
      printSpecFilePath.split('/').slice(-1)[0],
      S3.S3AssetCategory.PrintSpecs
    )
    if (printSpecUploadResult.error) {
      console.log(printSpecUploadResult.error)
      throw new Error('Failed to upload print spec')
    }

    this.printSpecUrl = S3.getObjectUrl(printSpecUploadResult.value)
    return this.save()
  }
}

Order.mongo = getModelForClass(Order)

export default Order
