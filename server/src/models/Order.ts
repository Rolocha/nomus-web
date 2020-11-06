import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { Card } from './Card'
import { CardVersion } from './CardVersion'
import { User } from './User'
import { Field, ObjectType } from 'type-graphql'
import { OrderState } from '../util/enums'
import { Ref } from './scalars'
import { BaseModel } from './BaseModel'
import { WhatIsIt } from '@typegoose/typegoose/lib/internal/constants'

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
  @prop({ required: true, ref: () => CardVersion, _id: false })
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

  @prop({ _id: false, ref: () => Card, required: false }, WhatIsIt.ARRAY)
  @Field(() => [Card], { nullable: true })
  cards: Array<Ref<Card>>

  //This correlates with OrderState at server/src/util/enums.ts
  @prop({ enum: OrderState, type: String, required: true })
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
