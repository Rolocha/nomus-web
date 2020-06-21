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
import { Ref, UUIDScalar, UUIDType } from './scalars'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class Order {
  static mongo: ReturnModelType<typeof Order>

  @Field()
  createdAt: Date

  @prop({ required: true, default: () => MUUID.v4() })
  @Field((type) => UUIDScalar)
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

  //User who ordered the cards
  @prop({ required: true, ref: User, type: Buffer, _id: false })
  @Field(() => User, { nullable: false })
  user: Ref<User>

  //Card Version that was ordered
  @prop({ _id: false, required: true })
  @Field(() => CardVersion, { nullable: false })
  cardVersion: Ref<CardVersion>

  //Quantity of cards in the order
  @prop({ required: false })
  @Field({ nullable: true })
  quantity: number

  //Price of cards in the order
  @prop({ required: true })
  @Field({ nullable: false })
  price: number

  @arrayProp({ _id: false, type: Buffer, required: false })
  @Field(() => [Card], { nullable: true })
  cards: Array<Ref<Card>>

  //This correlates with OrderState at server/src/util/enums.ts
  @prop({ required: true, enum: OrderState, type: String })
  @Field((type) => OrderState, { nullable: false })
  state: OrderState

  //Tracking Number for USPS
  @prop({ required: false })
  @Field({ nullable: true })
  tracking: string

  //Stripe Order Object Reference. For now, this is null but futre work will replace this
  @prop({ required: false })
  @Field({ nullable: true })
  stripeOrder: string
}

Order.mongo = getModelForClass(Order)

export default Order
