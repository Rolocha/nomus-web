import { getModelForClass, modelOptions, pre, prop, ReturnModelType } from '@typegoose/typegoose'
import { CardVersion } from './CardVersion'
import { User } from './User'
import { Field, ObjectType } from 'type-graphql'
import { OrderState } from '../util/enums'
import { Ref } from './scalars'
import { BaseModel } from './BaseModel'

@pre<Order>('save', async function (next) {
  if (this.isNew) {
    let checkDuplicate = true
    let shortId = this.shortId ?? Math.random().toString(36).substring(2, 8).toUpperCase()
    while (checkDuplicate) {
      const order = await Order.mongo.findOne({ shortId: shortId })
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
@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class Order extends BaseModel({
  prefix: 'ord',
}) {
  static mongo: ReturnModelType<typeof Order>

  @Field()
  createdAt: Date

  //User who ordered the cards
  @prop({ required: true, ref: () => User, type: String })
  @Field(() => User, { nullable: false })
  user: Ref<User>

  //Card Version that was ordered
  @prop({ required: true, ref: () => CardVersion, type: String })
  @Field(() => CardVersion, { nullable: false })
  cardVersion: Ref<CardVersion>

  //Quantity of cards in the order
  @prop({ required: false })
  @Field({ nullable: false })
  quantity: number

  //Price of cards in the order
  @prop({ required: true })
  @Field({ nullable: false })
  price: number

  //This correlates with OrderState at server/src/util/enums.ts
  @prop({ enum: OrderState, type: String, required: true })
  @Field((type) => OrderState, { nullable: false })
  state: OrderState

  //Tracking Number for USPS
  @prop({ required: false })
  @Field({ nullable: true })
  trackingNumber: string

  //Stripe PaymentIntent id. For now, this is null but future work will replace this
  @prop({ required: false })
  @Field({ nullable: true })
  paymentIntent: string

  @prop({ required: false, unique: true })
  @Field({ nullable: true })
  shortId: string
}

Order.mongo = getModelForClass(Order)

export default Order
