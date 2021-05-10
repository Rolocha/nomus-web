import { DocumentType, mongoose } from '@typegoose/typegoose'
import { AuthenticationError } from 'apollo-server-errors'
import { FileUpload } from 'graphql-upload'
import { GraphQLUpload } from 'apollo-server-express'
import { IApolloContext } from 'src/graphql/types'
import { CardVersion, Order } from 'src/models'
import { Address, OrderPrice } from 'src/models/subschemas'
import { User } from 'src/models/User'
import { CardSpecBaseType, OrderEventTrigger, OrderState, Role } from 'src/util/enums'
import { calculateCost } from 'src/util/pricing'
import * as S3 from 'src/util/s3'
import { stripe } from 'src/util/stripe'
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UnauthorizedError,
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
  @Field((type) => GraphQLUpload, { nullable: false })
  frontImageDataUrl: Promise<FileUpload>

  @Field((type) => GraphQLUpload, { nullable: true })
  backImageDataUrl?: Promise<FileUpload>
}

@InputType({
  description: 'Input to generate new Order object, regardless of what type of card base was used',
})
class BaseSubmitOrderInput {
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
class OrdersQueryInput {
  @Field({ nullable: true, description: 'specify a single order ID to query/update' })
  orderId: string

  @Field({ nullable: true, description: 'quantity of cards in an order' })
  quantity: number

  @Field({
    nullable: true,
    description: 'Credit/debit card Stripe token used for payment auth/capture',
  })
  stripeToken: string

  @Field((type) => Address, { nullable: true, description: 'shipping address for the order' })
  shippingAddress: Address

  @Field((type) => OrderPrice, { nullable: true, description: 'price calculated and paid for' })
  price: OrderPrice

  @Field({ nullable: true, description: 'XPS ship tracking number for package' })
  trackingNumber: string

  @Field({ nullable: true, description: 'shipping label stored in S3 for Hudson to print' })
  shippingLabelUrl: string

  @Field({ nullable: true, description: 'print spec to print on empty sheets stored in S3' })
  printSpecUrl: string

  @Field({ nullable: true, description: 'Notes about the order' })
  notes: string
}

@InputType({ description: 'Input to find orders' })
class OrdersInput extends OrdersQueryInput {
  @Field((type) => [String], { nullable: true, description: 'list of orderIds to filter for' })
  orderIds: [string]

  @Field((type) => [OrderState], {
    nullable: true,
    description: 'list of order states to filter for',
  })
  states: [OrderState]

  @Field({ nullable: true, description: 'user to filter for' })
  user: string
}

@InputType({ description: 'Payload for submitting a custom order' })
class SubmitCustomOrderInput extends BaseSubmitOrderInput {
  @Field((type) => CustomCardSpecInput)
  cardSpec: CustomCardSpecInput
}

@ObjectType()
class SubmitCustomOrderResponse {
  @Field()
  clientSecret: string

  @Field()
  orderId: string
}

@Resolver((of) => Order)
class OrderResolver {
  @FieldResolver()
  async user(@Root() order: Order) {
    return User.mongo.findById(order.user)
  }

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

  // Get multiple orders with flexible queries
  @Authorized(Role.Admin)
  @Query(() => [Order])
  async orders(
    @Arg('params', { nullable: true }) params: OrdersInput
  ): Promise<DocumentType<Order>[]> {
    const { orderIds, states, ...findOptions } = params
    if (orderIds) {
      findOptions['_id'] = { $in: orderIds }
    }
    if (states) {
      findOptions['state'] = { $in: states }
    }

    return Order.mongo.find(findOptions)
  }

  @Authorized(Role.Admin)
  @Mutation((type) => Order)
  // updateOrder cannot be used to update the state of the order.
  // Use transitionOrderState instead
  async updateOrder(
    @Arg('orderId', { nullable: true }) orderId: string | null,
    @Arg('payload', { nullable: true }) payload: OrdersQueryInput,
    @Ctx() context: IApolloContext
  ): Promise<DocumentType<Order>> {
    if (!context.user) {
      throw new UnauthorizedError()
    }
    const order = await Order.mongo.findOne({ _id: orderId })
    if (!order) {
      throw new Error('no-matching-order')
    }

    order.quantity = payload.quantity ?? order.quantity
    order.price = payload.price ?? order.price
    order.trackingNumber = payload.trackingNumber ?? order.trackingNumber
    order.shippingLabelUrl = payload.shippingLabelUrl ?? order.shippingLabelUrl
    order.printSpecUrl = payload.printSpecUrl ?? order.printSpecUrl
    order.shippingAddress = payload.shippingAddress ?? order.shippingAddress
    order.notes = payload.notes ?? order.notes

    await order.save()
    return order
  }

  @Authorized(Role.User)
  @Mutation((type) => Order)
  async transitionOrderState(
    @Arg('orderId', { nullable: false }) orderId: string,
    @Arg('futureState', (type) => OrderState, { nullable: false }) futureState: OrderState,
    @Arg('trigger', (type) => OrderEventTrigger, { nullable: true })
    trigger: OrderEventTrigger | null,
    @Ctx() context: IApolloContext
  ): Promise<DocumentType<Order>> {
    if (!context.user) {
      throw new Error('no-user-specified')
    }
    const order = await Order.mongo.findOne({ _id: orderId, user: context.user.id })
    if (!order) {
      throw new Error('no-matching-order')
    }

    const result = await order.transition(futureState, trigger)

    if (!result.isSuccess) {
      throw result.error
    }

    return result.value
  }

  // Transition a batch of orderIds. Used by Order Management Retool System once ready to send to Hudson
  @Authorized(Role.Admin)
  @Mutation((type) => [Order])
  async batchTransitionOrderState(
    @Arg('orderIds', (type) => [String], { nullable: false }) orderIds: [string],
    @Arg('futureState', (type) => OrderState, { nullable: false }) futureState: OrderState,
    @Arg('trigger', (type) => OrderEventTrigger, { nullable: true })
    trigger: OrderEventTrigger | null,
    @Ctx() context: IApolloContext
  ): Promise<DocumentType<Order>[]> {
    if (!context.user) {
      throw new Error('no-user-specified')
    }

    // start a mongoose Transaction, will only commit to db if all orders succeed.
    // Any errors thrown will result in rollback and no commit to the db
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const orders = await Order.mongo.find({ _id: { $in: orderIds } })
      if (!orders) {
        throw new Error('no-orders-found')
      }
      try {
        const orderTransitionPromises = orders.map(async (order) => {
          const res = await order.transition(futureState, trigger)
          if (!res.isSuccess) {
            throw res.error
          }
        })
        await Promise.all(orderTransitionPromises)
      } catch (err) {
        throw new Error(err)
      }
      await session.commitTransaction()
      return orders
    } catch (err) {
      await session.abortTransaction()
      throw new Error(err)
    } finally {
      session.endSession()
    }
  }

  // Get all orders for a User
  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Query(() => [Order], { nullable: true })
  async userOrders(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<Order[]> {
    const requesterUserId = context.user._id
    const requestedUserId = userId ?? requesterUserId

    const orders = await Order.mongo.find({ user: requestedUserId }).populate('cardVersion')

    return orders
  }

  // TODO: Make Card Builder work even for logged out users and eventually
  // remove this @Authorized decorator
  @Authorized(Role.User)
  @Mutation((type) => SubmitCustomOrderResponse)
  async submitCustomOrder(
    @Arg('payload', { nullable: false }) payload: SubmitCustomOrderInput,
    @Ctx() context: IApolloContext
  ): Promise<SubmitCustomOrderResponse> {
    const { user } = context
    if (user == null) {
      throw new AuthenticationError('No user')
    }
    const { quantity, cardSpec } = payload

    const cardVersion = new CardVersion.mongo({
      user: user.id,
      vcfNotes: cardSpec.vcfNotes,
      baseType: CardSpecBaseType.Custom,
    })

    // Upload the front image and put the resulting S3 key on the card version
    const frontImageUploadResult = await S3.uploadGraphQLFileToS3(
      await payload.cardSpec.frontImageDataUrl,
      `${cardVersion.id}/front`,
      S3.S3AssetCategory.CardVersions
    )

    if (frontImageUploadResult.isSuccess) {
      cardVersion.frontImageUrl = S3.getObjectUrl(frontImageUploadResult.value)
    } else {
      throw new Error('Failed to upload front card image')
    }

    // Upload the back image too if present (it's optional)
    if (payload.cardSpec.backImageDataUrl) {
      const backImageUploadResult = await S3.uploadGraphQLFileToS3(
        await payload.cardSpec.backImageDataUrl,
        `${cardVersion.id}/back`,
        S3.S3AssetCategory.CardVersions
      )
      if (backImageUploadResult.isSuccess) {
        cardVersion.backImageUrl = S3.getObjectUrl(backImageUploadResult.value)
      } else {
        throw new Error('Failed to upload back card image')
      }
    }

    await cardVersion.save()

    const subtotal = calculateCost(quantity)
    if (subtotal == null) {
      throw new Error(
        'Failed to calculate pricing, likely due to an unsupported quantity being used'
      )
    }

    // TODO: Factor in tax and shipping into calculateCost()
    const total = subtotal

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd', // We'll know we made it when we can change this line :')
    })

    const createdOrder = await Order.mongo.create({
      user: user.id,
      cardVersion: cardVersion.id,
      state: OrderState.Captured,
      paymentIntent: paymentIntent.id,
      price: {
        subtotal,
        shipping: 0,
        tax: 0,
        total,
      },
      ...payload,
    })

    return {
      clientSecret: paymentIntent.client_secret,
      orderId: createdOrder.id,
    }
  }
}
export default OrderResolver
