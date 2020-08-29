import { IApolloContext } from 'src/graphql/types'
import { CardVersion, Order } from 'src/models'
import { CardVersionModel } from 'src/models/CardVersion'
import { User } from 'src/models/User'
import { CardSpecBaseType, OrderState, Role } from 'src/util/enums'
import { calculateCost } from 'src/util/pricing'
import { stripe } from 'src/util/stripe'
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import MUUID from 'uuid-mongodb'
import { AdminOnlyArgs } from '../auth'

@InputType({ description: 'Specification for a new Card Version object for Order' })
class BaseCardSpecInput implements Partial<CardVersion> {
  @Field({ nullable: true })
  cardSlug?: string

  @Field({ nullable: true })
  vcfNotes?: string
}

@InputType({ description: 'Specification for a card built using custom assets' })
class CustomCardSpecInput extends BaseCardSpecInput {
  @Field({ nullable: false })
  frontImageDataUrl: string

  @Field({ nullable: true })
  backImageDataUrl?: string
}

@InputType({ description: 'Specification for a card built using a template' })
class TemplateCardSpecInput extends BaseCardSpecInput {
  @Field({ nullable: true })
  templateId?: string

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
  addressLine1?: string
  @Field({ nullable: true })
  addressLine2?: string
  @Field({ nullable: true })
  addressLine3?: string
}

@InputType({ description: 'A shipping address input' })
class ShippingAddressInput {
  @Field({ nullable: false })
  line1: string

  @Field({ nullable: true })
  line2?: string

  @Field({ nullable: false })
  city: string

  @Field({ nullable: false })
  state: string

  @Field({ nullable: false })
  postalCode: string
}

@InputType({
  description: 'Input to generate new Order object, regardless of what type of card base was used',
})
class BaseUpsertOrderInput implements Pick<Order, 'quantity'> {
  @Field({ nullable: true })
  orderId: string

  @Field({ nullable: true })
  quantity: number

  // Credit/debit card Stripe token we'll use for payment auth/capture
  @Field({ nullable: true })
  stripeToken: string

  @Field((type) => ShippingAddressInput, { nullable: true })
  shippingAddress: ShippingAddressInput
}

@InputType({ description: 'Input to generate new or update existing custom card Order' })
class UpsertCustomOrderInput extends BaseUpsertOrderInput {
  @Field((type) => CustomCardSpecInput)
  cardSpec: CustomCardSpecInput
}

@ObjectType()
class UpsertOrderResponse {
  @Field()
  clientSecret: string

  @Field()
  orderId: string
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
      return await Order.mongo.findById(orderId)
    } else {
      const order = await Order.mongo.findById(orderId).populate('user')
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
  @Mutation((type) => UpsertOrderResponse)
  async upsertCustomOrder(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Arg('payload', { nullable: false }) payload: UpsertCustomOrderInput,
    @Ctx() context: IApolloContext
  ): Promise<CreateOrderResponse> {
    const requestingUserId = context.user._id
    const userIdCheck = userId ?? requestingUserId
    const requestedUser: User = await User.mongo.findById(MUUID.from(userIdCheck))

    const { orderId, quantity, stripeToken, shippingAddress, cardSpec } = payload

    // TODO: Upload custom card assets to S3 so we can store those links in the CardVersion
    const frontImageUrl = '' // uploadToS3(cardSpec.frontImageDataUrl)
    const backImageUrl = '' // uploadToS3(cardSpec.backImageDataUrl)

    const createCardVersion: Partial<CardVersion> = {
      user: requestedUser._id,
      frontImageUrl: frontImageUrl,
      backImageUrl: backImageUrl,
      vcfNotes: cardSpec.vcfNotes,
      baseType: CardSpecBaseType.Custom,
    }
    const createdCardVersion = await CardVersionModel.create(createCardVersion)

    // TODO: Factor in tax and shipping into calculateCost()
    const price = calculateCost(quantity)
    if (price == null) {
      throw new Error('Invalid quantity specified, failed to calculate pricing')
    }

    // TODO: create if orderId is null, otherwise update existing one using Order.find({ id: orderId }).paymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'usd', // We'll know we made it when we can change this line :')
    })

    const createOrder: Partial<Order> = {
      user: requestedUser._id,
      cardVersion: createdCardVersion._id,
      state: OrderState.Captured,
      paymentIntent: paymentIntent.id,
      price,
      ...payload,
    }
    const createdOrder = await Order.mongo.create(createOrder)

    return {
      clientSecret: paymentIntent.client_secret,
      orderId: createdOrder.id,
    }
  }
}
export default OrderResolver
