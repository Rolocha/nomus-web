import OrderEvent from 'src/models/OrderEvent'
import { Role } from 'src/util/enums'
import { IApolloContext } from 'src/graphql/types'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'

@Resolver()
class OrderEventResolver {
  // Get a single OrderEvent
  @Query(() => OrderEvent, { nullable: true })
  async orderEvent(
    @Arg('orderEventId', { nullable: true }) orderEventId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<OrderEvent> {
    if (context.user.roles.includes(Role.Admin)) {
      return await OrderEvent.mongo.findById(orderEventId).populate('order')
    }
  }

  // Get all OrderEvents of an Order
  @Query(() => [OrderEvent], { nullable: true })
  async orderEventsForOrder(
    @Arg('orderId', { nullable: true }) orderId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<OrderEvent[]> {
    if (context.user.roles.includes(Role.Admin)) {
      return await OrderEvent.mongo.find({ order: orderId }).sort({ createdAt: 1 })
    }
  }
}
export default OrderEventResolver
