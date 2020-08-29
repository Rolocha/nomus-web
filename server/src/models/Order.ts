import {
  arrayProp,
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose'
import { Card, CardVersion, User } from 'src/models'
import { Field, ObjectType } from 'type-graphql'
import { OrderState } from '../util/enums'
import { Ref } from './scalars'
import { BaseModel } from './BaseModel'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class Order extends BaseModel({
  prefix: 'ord',
}) {
  static mongo: ReturnModelType<typeof Order>

  @Field()
  createdAt: Date

  //User who ordered the cards
  @prop({ required: true, ref: User, type: Buffer, _id: false })
  @Field(() => User, { nullable: false })
  user: Ref<User>

  //Card Version that was ordered
  @prop({ required: true, ref: CardVersion, type: Buffer, _id: false })
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

  @arrayProp({ _id: false, type: Buffer, required: false })
  @Field(() => [Card], { nullable: true })
  cards: Array<Ref<Card>>

  //This correlates with OrderState at server/src/util/enums.ts
  @prop({ required: true })
  @Field((type) => OrderState, { nullable: false })
  state: OrderState

  //Tracking Number for USPS
  @prop({ required: false })
  @Field({ nullable: true })
  trackingNumber: string

  //Stripe PaymentIntent id. For now, this is null but futre work will replace this
  @prop({ required: false })
  @Field({ nullable: true })
  paymentIntent: string
}

Order.mongo = getModelForClass(Order)

export default Order
