import {
  arrayProp,
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose'
import { Card, CardVersion, User } from 'src/models'
import { Field, ObjectType } from 'type-graphql'
import MUUID from 'uuid-mongodb'
import { OrderState } from '../util/enums'
import { Ref, UUIDType } from './scalars'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class Order {
  static mongo: ReturnModelType<typeof Order>

  @Field()
  createdAt: Date

  @prop({ required: true, default: () => MUUID.v4() })
  _id: UUIDType

  // Override the 'id' virtual property getters/setters since Mongoose doesn't
  // know how to handle our custom MUUID implementation
  @Field() // Expose the pretty underscore-less string version on GraphQL schema
  get id(): string {
    return MUUID.from(this._id).toString()
  }

  set id(id: string) {
    this._id = MUUID.from(id)
  }

  // Human-presentable order number
  @prop({ required: true, unique: true })
  @Field({ nullable: false })
  orderNumber: string

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

  //Stripe Order Object Reference. For now, this is null but futre work will replace this
  @prop({ required: false })
  @Field({ nullable: true })
  stripeOrder: string
}

Order.mongo = getModelForClass(Order)

export default Order
