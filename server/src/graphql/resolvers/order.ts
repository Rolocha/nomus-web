import { DocumentType } from '@typegoose/typegoose'
import { IApolloContext } from 'src/graphql/types'
import { CardVersion, Order } from 'src/models'
import { CardVersionModel } from 'src/models/CardVersion'
import { Address, OrderPrice } from 'src/models/subschemas'
import { User } from 'src/models/User'
import { CardSpecBaseType, OrderEventTrigger, OrderState, Role } from 'src/util/enums'
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

// @InputType({ description: 'Specification for a card built using a template' })
// class TemplateCardSpecInput extends BaseCardSpecInput {
//   @Field({ nullable: true })
//   templateId?: string

//   @Field({ nullable: true })
//   firstName?: string
//   @Field({ nullable: true })
//   middleName?: string
//   @Field({ nullable: true })
//   lastName?: string

//   @Field({ nullable: true })
//   phoneNumber?: string

//   @Field({ nullable: true })
//   email?: string

//   @Field({ nullable: true })
//   title?: string

//   @Field({ nullable: true })
//   company?: string

//   @Field({ nullable: true })
//   addressLine1?: string
//   @Field({ nullable: true })
//   addressLine2?: string
//   @Field({ nullable: true })
//   addressLine3?: string
// }

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

  @Field((type) => Address, { nullable: true })
  shippingAddress: Address
}

@InputType({ description: 'Input to update fields on an existing Order' })
class FullOrderInput extends BaseUpsertOrderInput {
  @Field((type) => OrderPrice, { nullable: true })
  price: OrderPrice

  @Field((type) => OrderState, { nullable: false })
  state: OrderState

  @Field({ nullable: true })
  trackingNumber: string

  @Field({ nullable: true })
  shippingLabelUrl: string

  @Field({ nullable: true })
  printSpecUrl: string
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

  @Authorized(Role.Admin)
  @Mutation((type) => Order)
  async orderUpdate(
    @Arg('orderId', { nullable: true }) orderId: string | null,
    @Arg('payload', { nullable: true }) payload: FullOrderInput,
    @Ctx() context: IApolloContext
  ): Promise<DocumentType<Order>> {
    if (!context.user) {
      throw new Error('no-user-specified')
    }
    const order = await Order.mongo.findOne({ _id: orderId })
    if (!order) {
      throw new Error('no-matching-order')
    }

    if (payload.state !== order.state) {
      const result = await order.transition(payload.state, OrderEventTrigger.Nomus)
      if (result.error) {
        throw result.error
      }
    }

    order.quantity = payload.quantity ?? order.quantity
    order.price = payload.price ?? order.price
    order.trackingNumber = payload.trackingNumber ?? order.trackingNumber
    order.shippingLabelUrl = payload.shippingLabelUrl ?? order.shippingLabelUrl
    order.printSpecUrl = payload.printSpecUrl ?? order.printSpecUrl
    order.shippingAddress = payload.shippingAddress ?? order.shippingAddress

    await order.save()
    return order
  }

  @Authorized(Role.User)
  @Mutation((type) => Order)
  async transitionOrderState(
    @Arg('orderId', { nullable: true }) orderId: string | null,
    @Arg('futureState', { nullable: true }) futureState: string | null,
    @Ctx() context: IApolloContext
  ): Promise<DocumentType<Order>> {
    if (!context.user) {
      throw new Error('no-user-specified')
    }
    const order = await Order.mongo.findOne({ _id: orderId, user: context.user.id })
    if (!order) {
      throw new Error('no-matching-order')
    }

    if (futureState in OrderState) {
      const result = await order.transition(futureState as OrderState)
      if (!result.isSuccess) {
        throw result.error
      }
      return result.value
    } else {
      throw new Error('invalid-transition')
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

    const orders = await Order.mongo.find({ user: requestedUserId }).populate('cardVersion')

    return orders
  }

  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Mutation((type) => UpsertOrderResponse)
  async upsertCustomOrder(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Arg('payload', { nullable: false }) payload: UpsertCustomOrderInput,
    @Ctx() context: IApolloContext
  ): Promise<UpsertOrderResponse> {
    const requestingUserId = context.user._id
    const userIdCheck = userId ?? requestingUserId
    const requestedUser: User = await User.mongo.findById(userIdCheck)

    const { quantity, cardSpec } = payload

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

    const subtotal = calculateCost(quantity)
    if (subtotal == null) {
      throw new Error('Invalid quantity specified, failed to calculate pricing')
    }

    // TODO: Factor in tax and shipping into calculateCost()
    const total = subtotal

    // TODO: create if orderId is null, otherwise update existing one using Order.find({ id: orderId }).paymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd', // We'll know we made it when we can change this line :')
    })

    const createOrder: Partial<Order> = {
      user: requestedUser._id,
      cardVersion: createdCardVersion._id,
      state: OrderState.Captured,
      paymentIntent: paymentIntent.id,
      price: {
        subtotal,
        shipping: 0,
        tax: 0,
        total,
      },
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
