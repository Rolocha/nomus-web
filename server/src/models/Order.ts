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
import { OrderEventTrigger, OrderState } from '../util/enums'
import { Ref } from './scalars'
import { BaseModel } from './BaseModel'
import { Address, OrderPrice } from './subschemas'
import { EventualResult, Result } from 'src/util/error'
import OrderEvent from './OrderEvent'

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
      // await mongoose.model('OrderEvent').create({
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

  // Mapping of current possible state transitions according to our Order Flow State Machine
  // https://www.notion.so/nomus/Order-Flow-State-Machine-e44affeb35764cc488ac771fa9e28851
  private stateTransitionMap() {
    type EnumDictionary<T extends string | symbol | number> = {
      [K in T]: T[]
    }
    const res: EnumDictionary<OrderState> = {
      [OrderState.Captured]: [OrderState.Paid, OrderState.Canceled],
      [OrderState.Paid]: [OrderState.Creating, OrderState.Canceled],
      [OrderState.Creating]: [OrderState.Created],
      [OrderState.Created]: [OrderState.Enroute],
      [OrderState.Enroute]: [OrderState.Fulfilled],
      [OrderState.Fulfilled]: [],
      [OrderState.Canceled]: [],
    }

    return res
  }

  // Checks if a proposed transition can be accomplished in our state machine
  private isEligibleTransition(futureState: OrderState): boolean {
    if (this.stateTransitionMap()[this.state].includes(futureState)) {
      return true
    }
    return false
  }

  // Public instance method to transition OrderState
  public async transition(
    this: DocumentType<Order>,
    futureState: OrderState,
    trigger = OrderEventTrigger.Nomus
  ): EventualResult<DocumentType<Order>, 'invalid-transition' | 'save-error'> {
    if (this.isEligibleTransition(futureState)) {
      try {
        // Trying to render the OrderEvent Model creates a circular dependency at compile time.
        // This circumvents compile time issues, to have it occur during execution time.
        await OrderEvent.mongo.create({
          // await mongoose.model('OrderEvent').create({
          order: this.id,
          trigger,
          state: futureState,
        })
        this.state = futureState
        await this.save()
        return Result.ok(this)
      } catch (e) {
        return Result.fail('save-error')
      }
    }
    return Result.fail('invalid-transition')
  }
}

Order.mongo = getModelForClass(Order)

export default Order
