import { DocumentType, mongoose } from '@typegoose/typegoose'
import { AuthenticationError } from 'apollo-server-errors'
import { FileUpload } from 'graphql-upload'
import { GraphQLUpload } from 'apollo-server-express'
import { IApolloContext } from 'src/graphql/types'
import { CardVersion, Order } from 'src/models'
import {
  Address,
  OrderPrice,
  TemplateColorScheme,
  TemplateContactInfoFields,
} from 'src/models/subschemas'
import { User } from 'src/models/User'
import { CardSpecBaseType, OrderEventTrigger, OrderState, Role } from 'src/util/enums'
import { getCostSummary } from 'src/util/pricing'
import * as S3 from 'src/util/s3'
import { Stripe, stripe } from 'src/util/stripe'
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

@InputType({
  description: 'Input to generate new Order object, regardless of what type of card base was used',
})
class BaseSubmitOrderInput {
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

@InputType({ description: 'Payload for submitting a card builder order with a custom design' })
class SubmitCustomOrderInput extends BaseSubmitOrderInput {
  @Field((type) => GraphQLUpload, { nullable: false })
  frontImageDataUrl: Promise<FileUpload>

  @Field((type) => GraphQLUpload, { nullable: true })
  backImageDataUrl?: Promise<FileUpload>
}

@InputType({
  description: 'Payload for submitting a card builder order with a template-based design',
})
class SubmitTemplateOrderInput extends BaseSubmitOrderInput {
  @Field({ nullable: false })
  templateId: string

  @Field({ nullable: false })
  cardVersionId: string

  @Field((type) => TemplateColorScheme, { nullable: false })
  colorScheme: TemplateColorScheme

  @Field((type) => TemplateContactInfoFields, { nullable: false })
  contactInfo: TemplateContactInfoFields

  @Field((type) => GraphQLUpload, { nullable: true })
  graphic?: Promise<FileUpload> | null

  @Field({ nullable: false })
  qrCodeUrl: string

  @Field((type) => GraphQLUpload, { nullable: false })
  frontImageDataUrl: Promise<FileUpload>

  @Field((type) => GraphQLUpload, { nullable: true })
  backImageDataUrl?: Promise<FileUpload> | null
}

@ObjectType()
class SubmitOrderResponse {
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
  @FieldResolver()
  async cardVersion(@Root() order: Order) {
    return CardVersion.mongo.findById(order.cardVersion)
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
  @Mutation((type) => Order, {
    description:
      'Updates the simple fields of an order; for updating the order state, use transitionOrderState instead',
  })
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
    const order = context.user.roles.includes(Role.Admin)
      ? await Order.mongo.findOne({ _id: orderId })
      : await Order.mongo.findOne({ _id: orderId, user: context.user.id })

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

  @Authorized(Role.User)
  @Mutation((type) => SubmitOrderResponse, {
    description:
      'Handles submission of an order created via the Card Builder UI for a custom user design',
  })
  async submitCustomOrder(
    @Arg('payload', { nullable: false }) payload: SubmitCustomOrderInput,
    @Ctx() context: IApolloContext
  ): Promise<SubmitOrderResponse> {
    const { user } = context
    if (user == null) {
      throw new AuthenticationError('No user')
    }

    const cardVersion = new CardVersion.mongo({
      user: user.id,
      baseType: CardSpecBaseType.Custom,
    })

    const uploadedImageUrls = await this.uploadCardImages(
      {
        front: payload.frontImageDataUrl,
        back: payload.backImageDataUrl,
      },
      cardVersion.id
    )

    cardVersion.frontImageUrl = uploadedImageUrls.front
    if (uploadedImageUrls.back) {
      cardVersion.backImageUrl = uploadedImageUrls.back
    }

    await cardVersion.save()

    const { createdOrder, paymentIntent } = await this.createOrderAndPayment({
      user,
      cardVersion,
      quantity: payload.quantity,
      shippingAddress: payload.shippingAddress,
    })

    // Update the user's default card version to the newly created one
    user.defaultCardVersion = cardVersion.id
    await user.save()

    return {
      orderId: createdOrder.id,
      clientSecret: paymentIntent.client_secret,
    }
  }

  @Authorized(Role.User)
  @Mutation((type) => SubmitOrderResponse, {
    description:
      'Handles submission of an order created via the Card Builder UI for a template-based design',
  })
  async submitTemplateOrder(
    @Arg('payload', { nullable: false }) payload: SubmitTemplateOrderInput,
    @Ctx() context: IApolloContext
  ): Promise<SubmitOrderResponse> {
    const { user } = context
    if (user == null) {
      throw new AuthenticationError('No user')
    }

    const cardVersion = await CardVersion.mongo.findById(payload.cardVersionId)
    if (cardVersion == null) {
      throw new Error(`No card version found with id: ${payload.cardVersionId}`)
    }

    // Update the card version with the customized template details
    cardVersion.contactInfo = payload.contactInfo
    cardVersion.colorScheme = payload.colorScheme
    cardVersion.qrCodeUrl = payload.qrCodeUrl

    // Even though the above fields contain all the data necessary to render the card image,
    // for now we still require images to be rendered on the client side and sent to the backend.
    // This is because the image generation happens using HTML5 Canvas which isn't supported natively
    // in Node.
    //
    // Down the line, we can & might want to enable server-side card image generation by leveraging
    // a third-party NPM package that implements the Canvas API in Node, as well as by refactoring the
    // template rendering logic (in src/client/templates) to be isomorphic for use on both client & server.
    const uploadedImageUrls = await this.uploadCardImages(
      {
        front: payload.frontImageDataUrl,
        back: payload.backImageDataUrl,
      },
      cardVersion.id
    )

    cardVersion.frontImageUrl = uploadedImageUrls.front
    if (uploadedImageUrls.back) {
      cardVersion.backImageUrl = uploadedImageUrls.back
    }
    await cardVersion.save()

    const { createdOrder, paymentIntent } = await this.createOrderAndPayment({
      user,
      cardVersion,
      quantity: payload.quantity,
      shippingAddress: payload.shippingAddress,
    })

    // Update the user's default card version to the newly created one
    user.defaultCardVersion = cardVersion.id
    await user.save()

    return {
      orderId: createdOrder.id,
      clientSecret: paymentIntent.client_secret,
    }
  }

  /**
   * Private helpers
   */

  async createPaymentIntent(amount: number, user: DocumentType<User>, orderId: string) {
    return await stripe.paymentIntents.create({
      /* eslint-disable camelcase */
      amount,
      currency: 'usd', // We'll know we made it when we can change this line :')
      receipt_email: user.email,
      metadata: {
        orderId,
      },
      /* eslint-enable camelcase */
    })
  }

  async uploadCardImages(
    imageFiles: { front: Promise<FileUpload>; back?: Promise<FileUpload> },
    cardVersionId: string
  ) {
    // Upload the front image and put the resulting S3 key on the card version
    const frontImageUploadResult = await S3.uploadGraphQLFileToS3(
      await imageFiles.front,
      `${cardVersionId}/front`,
      S3.S3AssetCategory.CardVersions
    )

    if (!frontImageUploadResult.isSuccess) {
      throw new Error(`Failed to upload front card image: ${frontImageUploadResult.error}`)
    }

    let backImageUploadResult = null
    if (imageFiles.back) {
      backImageUploadResult = await S3.uploadGraphQLFileToS3(
        await imageFiles.back,
        `${cardVersionId}/back`,
        S3.S3AssetCategory.CardVersions
      )
      if (!backImageUploadResult.isSuccess) {
        throw new Error('Failed to upload back card image')
      }
    }

    return {
      front: S3.getObjectUrl(frontImageUploadResult.value),
      back: backImageUploadResult ? S3.getObjectUrl(backImageUploadResult.value) : null,
    }
  }

  async createOrderAndPayment({
    user,
    cardVersion,
    quantity,
    shippingAddress,
  }: {
    user: DocumentType<User>
    cardVersion: DocumentType<CardVersion>
    quantity: number
    shippingAddress: Address
  }): Promise<{ createdOrder: DocumentType<Order>; paymentIntent: Stripe.PaymentIntent }> {
    const costSummary = getCostSummary(quantity, shippingAddress.state)
    if (costSummary == null) {
      throw new Error(
        'Failed to calculate pricing, likely due to an unsupported quantity being used'
      )
    }

    const orderId = Order.createId()
    const paymentIntent = await this.createPaymentIntent(costSummary.total, user, orderId)
    const createdOrder = await Order.mongo.create({
      _id: orderId,
      user: user.id,
      cardVersion: cardVersion.id,
      state: OrderState.Captured,
      paymentIntent: paymentIntent.id,
      quantity,
      shippingAddress,
      price: {
        subtotal: costSummary.subtotal,
        shipping: costSummary.shipping,
        tax: costSummary.estimatedTaxes,
        total: costSummary.total,
      },
    })
    return { createdOrder, paymentIntent }
  }
}
export default OrderResolver
