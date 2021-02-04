import OrderEvent from 'src/models/OrderEvent'
import { Role } from 'src/util/enums'
import { IApolloContext } from 'src/graphql/types'
import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql'

@Resolver()
class OrderEventResolver {
  // Get a single OrderEvent
  @Authorized(Role.Admin)
  @Query(() => OrderEvent, { nullable: true })
  async orderEvent(
    @Arg('orderEventId', { nullable: true }) orderEventId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<OrderEvent> {
    return await OrderEvent.mongo.findById(orderEventId).populate('order')
  }

  // Get all OrderEvents of an Order
  @Authorized(Role.Admin)
  @Query(() => [OrderEvent], { nullable: true })
  async orderEventsForOrder(
    @Arg('orderId', { nullable: true }) orderId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<OrderEvent[]> {
    return await OrderEvent.mongo.find({ order: orderId }).sort({ createdAt: 1 })
  }
}
export default OrderEventResolver
