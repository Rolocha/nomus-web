import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  ReturnModelType,
  DocumentType,
} from '@typegoose/typegoose'
import { CardVersion } from './CardVersion'
import { User } from './User'
import { Field, ObjectType } from 'type-graphql'
import { OrderState } from '../util/enums'
import { Ref } from './scalars'
import { BaseModel } from './BaseModel'
import { Address, OrderPrice } from './subschemas'
import { EventualResult, Result } from 'src/util/error'

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

  static CANCELABLE_STATES = [OrderState.Captured, OrderState.Paid]

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

  // Stripe PaymentIntent id. For now, this is null but future work will replace this
  @prop({ required: false })
  @Field({ nullable: true })
  paymentIntent: string

  @prop({
    required: false,
    unique: true,
    description: 'ID printed onto a sheet for the print tech to link a user',
  })
  @Field({ nullable: true })
  shortId: string

  @prop({ required: false, description: 'URL pointing to shipping label document' })
  shippingLabelUrl: string

  @prop({ required: false, description: 'URL pointing to the document to be printed' })
  printSpecUrl: string

  @prop({ _id: false, required: false, description: 'Address to ship this order to' })
  @Field(() => Address, { nullable: true })
  shippingAddress: Address

  private canBeCanceled() {
    return Order.CANCELABLE_STATES.includes(this.state)
  }

  public async cancel(
    this: DocumentType<Order>
  ): EventualResult<DocumentType<Order>, 'cannot-be-canceled'> {
    if (!this.canBeCanceled()) {
      return Result.fail('cannot-be-canceled')
    }

    this.state = OrderState.Canceled
    await this.save()
    return Result.ok(this)
  }
}

Order.mongo = getModelForClass(Order)

export default Order
