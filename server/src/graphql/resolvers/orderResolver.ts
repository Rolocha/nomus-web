import { IApolloContext } from 'src/graphql/types'
import { CardVersion, Order } from 'src/models'
import { CardVersionModel } from 'src/models/CardVersion'
import { User } from 'src/models/User'
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  ObjectType,
} from 'type-graphql'
import MUUID from 'uuid-mongodb'
import { AdminOnlyArgs } from '../auth'
import { OrderState, Role } from 'src/util/enums'

@InputType({ description: 'Input to generate new Order object' })
class OrderGenerationInput implements Partial<Order> {
  @Field({ nullable: false })
  quantity: number

  @Field({ nullable: false })
  price: number
}

@InputType({ description: 'Input to generate new Card Version object for Order' })
class CardVersionInput implements Partial<CardVersion> {
  @Field({ nullable: false })
  cardSlug: string

  @Field({ nullable: true })
  firstName?: string
  @Field({ nullable: true })
  middleName?: string
  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  company?: string

  @Field({ nullable: true })
  vcfNotes?: string

  @Field({ nullable: true })
  addressLine1?: string
  @Field({ nullable: true })
  addressLine2?: string
  @Field({ nullable: true })
  addressLine3?: string

  @Field({ nullable: true })
  frontImageUrl: string

  @Field({ nullable: true })
  backImageUrl: string

  @Field({ nullable: true })
  vcfUrl?: string

  @Field({ nullable: true })
  templateId?: string
}

@ObjectType()
class NewOrderAndCardVersion {
  @Field()
  orderId: string

  @Field()
  cardVersionId: string
}

@Resolver()
class OrderResolver {
  //Get a single order
  @Authorized(Role.User)
  @Query(() => Order, { nullable: true })
  async order(
    @Arg('orderId', { nullable: true }) orderId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<Order | Error> {
    if (context.user.roles.includes(Role.Admin)) {
      return await Order.mongo.findById(MUUID.from(orderId))
    } else {
      const order = await Order.mongo.findById(MUUID.from(orderId)).populate('user')
      if ((order.user as User).id === context.user.id) {
        return order as Order
      } else {
        return Error('User is not authorized to access order')
      }
    }
  }

  //Get all orders for a User
  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Query(() => [Order], { nullable: true })
  async orders(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<Order[]> {
    const requesterUserId = context.user._id
    const requestedUserId = userId ?? requesterUserId

    const orders = await Order.mongo
      .find({ user: MUUID.from(requestedUserId) })
      .populate('cardVersion')

    return orders
  }

  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Mutation((type) => NewOrderAndCardVersion)
  async createNewOrder(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Arg('orderPayload', { nullable: false }) orderPayload: OrderGenerationInput,
    @Arg('cardVersionPayload', { nullable: false }) cardVersionPayload: CardVersionInput,
    @Ctx() context: IApolloContext
  ): Promise<NewOrderAndCardVersion> {
    const requestingUserId = context.user._id
    const userIdCheck = userId ?? requestingUserId
    const requestedUser: User = await User.mongo.findById(MUUID.from(userIdCheck))

    const createCardVersion: Partial<CardVersion> = {
      user: requestedUser._id,
      cardSlug: cardVersionPayload.cardSlug,
      name: {
        first: cardVersionPayload.firstName ?? requestedUser.name.first,
        middle: cardVersionPayload.middleName ?? requestedUser.name.middle,
        last: cardVersionPayload.lastName ?? requestedUser.name.last,
      },
      phoneNumber: cardVersionPayload.phoneNumber ?? requestedUser.phoneNumber,
      email: cardVersionPayload.email ?? requestedUser.email,
      title: cardVersionPayload.title,
      company: cardVersionPayload.company,
      vcfNotes: cardVersionPayload.vcfNotes,
      address: {
        line1: cardVersionPayload.addressLine1,
        line2: cardVersionPayload.addressLine2,
        line3: cardVersionPayload.addressLine3,
      },
      frontImageUrl: cardVersionPayload.frontImageUrl,
      backImageUrl: cardVersionPayload.backImageUrl,
      vcfUrl: cardVersionPayload.vcfUrl,
    }
    const createdCardVersion = await CardVersionModel.create(createCardVersion)

    const createOrder: Partial<Order> = {
      user: requestedUser._id,
      cardVersion: createdCardVersion._id,
      state: OrderState.Captured,
      ...orderPayload,
    }
    const createdOrder = await Order.mongo.create(createOrder)

    const returnVal: NewOrderAndCardVersion = {
      orderId: createdOrder.id,
      cardVersionId: createdCardVersion.id,
    }

    return returnVal
  }
}
export default OrderResolver
