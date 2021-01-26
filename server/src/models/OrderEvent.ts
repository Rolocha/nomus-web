import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { OrderEventTrigger, OrderState } from 'src/util/enums'
import { Field, ObjectType } from 'type-graphql'
import { BaseModel } from './BaseModel'
import Order from './Order'
import { Ref } from './scalars'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class OrderEvent extends BaseModel({
  prefix: 'ordev',
}) {
  static mongo: ReturnModelType<typeof OrderEvent>

  @Field()
  createdAt: Date

  // Order which had an event happen
  @prop({ required: true, ref: () => Order, type: String })
  @Field(() => Order, { nullable: false })
  order: Ref<Order>

  // Triggers for OrderState changes
  @prop({ enum: OrderEventTrigger, type: String, required: false })
  @Field((type) => OrderEventTrigger, { nullable: true })
  trigger: OrderEventTrigger

  // State after transition completed
  @prop({ enum: OrderState, type: String, required: true })
  @Field((type) => OrderState, { nullable: false })
  state: OrderState

  // Extra information about the transition, optional
  @prop({ required: false })
  @Field({ nullable: true })
  extraMetadata: string
}

OrderEvent.mongo = getModelForClass(OrderEvent)

export default OrderEvent
