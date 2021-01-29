import OrderEvent from 'src/models/OrderEvent'
import { Role } from 'src/util/enums'
import { IApolloContext } from 'src/graphql/types'
import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql'
import { Order } from 'src/models'

@Resolver()
class OrderEventResolver {
  //Get a single OrderEvent
  @Authorized(Role.User)
  @Query(() => OrderEvent, { nullable: true })
  async orderEvent(
    @Arg('orderEventId', { nullable: true }) orderEventId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<OrderEvent | Error> {
    if (context.user.roles.includes(Role.Admin)) {
      return await OrderEvent.mongo.findById(orderEventId)
    } else {
      const orderEvent = await OrderEvent.mongo.findById(orderEventId).populate('order')
      if ((orderEvent.order as Order).user === context.user.id) {
        return orderEvent as OrderEvent
      } else {
        return Error('not-authorized')
      }
    }
  }

  //Get all OrderEvents of an Order
  @Authorized(Role.User)
  @Query(() => [OrderEvent], { nullable: true })
  async orderEventsForOrder(
    @Arg('orderId', { nullable: true }) orderId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<OrderEvent[] | Error> {
    const order = await Order.mongo.findById(orderId)
    if (context.user.roles.includes(Role.Admin) || order.user === context.user.id) {
      return await OrderEvent.mongo.find({ order: orderId }).sort({ createdAt: 1 })
    } else {
      return Error('not-authorized')
    }
  }
}
export default OrderEventResolver
