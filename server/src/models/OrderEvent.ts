import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { OrderEventTrigger, OrderState } from 'src/util/enums'
import { Field, ObjectType } from 'type-graphql'
import { BaseModel } from './BaseModel'
import Order from './Order'
import { Ref } from './scalars'

@ObjectType()
class OrderEvent extends BaseModel({
  prefix: 'ordev',
}) {
  static mongo: ReturnModelType<typeof OrderEvent>

  // Order which had an event happen
  // This ref in the prop is a string to delay introspection until runtime
  @prop({ required: true, ref: 'Order', type: String })
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
}

OrderEvent.mongo = getModelForClass(OrderEvent)

export default OrderEvent
