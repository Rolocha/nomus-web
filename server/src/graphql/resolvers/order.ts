import { DocumentType } from '@typegoose/typegoose'
import { AuthenticationError } from 'apollo-server-errors'
import { GraphQLUpload } from 'apollo-server-express'
import { FileUpload } from 'graphql-upload'
import { BASE_URL, DEPLOY_ENV } from 'src/config'
import { IApolloContext } from 'src/graphql/types'
import { CardVersion, Order } from 'src/models'
import {
  Address,
  OrderPrice,
  PersonName,
  TemplateColorScheme,
  TemplateContactInfoFields,
} from 'src/models/subschemas'
import { User } from 'src/models/User'
import { performTransaction } from 'src/util/db'
import { CardSpecBaseType, OrderEventTrigger, OrderState, Role } from 'src/util/enums'
import { getCostSummary, isValidQuantity, QUANTITY_TO_PRICE } from 'src/util/pricing'
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
  previousOrder: string | null

  @Field({ nullable: false })
  quantity: number
}

@InputType({ description: 'Input to update fields on an existing Order' })
class OrdersQueryInput {
  @Field({ nullable: true, description: 'specify a single order ID to query/update' })
  orderId: string

  @Field({ nullable: true, description: 'quantity of cards in an order' })
  quantity: number

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

  @Field({
    nullable: false,
    description: 'The human-readable, user-presentable name of the template',
  })
  templateName: string

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

@InputType({ description: 'Input to submit a manual order from the admin panel' })
class ManualOrderInput {
  @Field({ nullable: false })
  email: string

  @Field((type) => PersonName, { nullable: true })
  name: PersonName

  @Field({ nullable: false })
  quantity: number

  @Field((type) => Address, { nullable: false })
  shippingAddress: Address

  @Field((type) => OrderPrice, { nullable: true })
  price: OrderPrice

  @Field((type) => GraphQLUpload, { nullable: false })
  frontImageDataUrl: Promise<FileUpload>

  @Field((type) => GraphQLUpload, { nullable: true })
  backImageDataUrl?: Promise<FileUpload> | null

  @Field()
  paymentInfo?: string | null
}

@ObjectType()
class SubmitOrderResponse {
  @Field()
  checkoutSession: string

  @Field()
  orderId: string
}

@ObjectType()
class ManualOrderResponse {
  @Field()
  checkoutSession: string

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

    const orders = await Order.mongo.find({ _id: { $in: orderIds } })
    if (!orders) {
      throw new Error('no-orders-found')
    }

    await performTransaction(async () =>
      Promise.all(
        orders.map(async (order) => {
          const res = await order.transition(futureState, trigger)
          if (!res.isSuccess) {
            throw res.error
          }
          return res.value
        })
      )
    )

    return orders
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

    this.validateBaseSubmitOrderInput(payload)

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

    const order = await this.createOrUpdateExistingOrder({
      user,
      cardVersion,
      payload,
    })

    await order.updatePrintSpecPDF()

    // Update the user's default card version to the newly created one
    user.defaultCardVersion = cardVersion.id
    await user.save()

    return {
      orderId: order.id,
      checkoutSession: order.checkoutSession,
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

    this.validateBaseSubmitOrderInput(payload)

    const cardVersion = await CardVersion.mongo.findById(payload.cardVersionId)
    if (cardVersion == null) {
      throw new Error(`No card version found with id: ${payload.cardVersionId}`)
    }

    // Update the card version with the customized template details
    cardVersion.templateId = payload.templateId
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

    const order = await this.createOrUpdateExistingOrder({
      user,
      cardVersion,
      payload,
    })

    await order.updatePrintSpecPDF()

    // Update the user's default card version to the newly created one
    user.defaultCardVersion = cardVersion.id
    await user.save()

    return {
      orderId: order.id,
      checkoutSession: order.checkoutSession,
    }
  }

  @Authorized(Role.Admin)
  @Mutation((type) => ManualOrderResponse, {
    description: 'Handles manual submission of an order from admin panel',
  })
  async submitManualOrder(
    @Arg('payload', { nullable: false }) payload: ManualOrderInput
  ): Promise<ManualOrderResponse> {
    const { email, name, price: payloadPrice, quantity, shippingAddress } = payload
    let user = await User.mongo.findOne({ email })
    if (!user) {
      const password = Math.random().toString(36).slice(-8)
      const res = await User.mongo.createNewUser({ email, name, password })
      if (res.isSuccess) {
        user = res.getValue()
        User.sendPasswordResetEmail(email)
      } else {
        throw new Error('Failed to create new user')
      }
    }

    let price: OrderPrice
    if (!payloadPrice) {
      const costSummary = getCostSummary(quantity, shippingAddress.state)
      if (costSummary == null) {
        throw new Error(
          'Failed to calculate pricing, likely due to an unsupported quantity being used'
        )
      }
      price = {
        subtotal: costSummary.subtotal,
        shipping: costSummary.shipping,
        // We don't know the cost of tax yet since that requires knowing the shipping address
        // We'll update this (and total) once Stripe checkout completes, in server/src/api/stripehooks.ts
        tax: costSummary.estimatedTaxes,
        total: costSummary.total,
      }
    } else {
      price = payloadPrice
    }

    return { orderId: '', checkoutSession: '' }
  }

  /**
   * Private helpers
   */
  async validateBaseSubmitOrderInput(payload: BaseSubmitOrderInput) {
    if (payload.previousOrder) {
      const isValidPreviousOrder = await Order.mongo.exists({ _id: payload.previousOrder })
      if (!isValidPreviousOrder) {
        throw new Error(
          `Invalid previous order: could not find an order with id ${payload.previousOrder}`
        )
      }
    }
    if (payload.quantity % 25 !== 0) {
      throw new Error('Invalid quantity: not a multiple of 25')
    }
  }

  // Creates a Checkout Session
  async createCheckoutSession(
    order: DocumentType<Order>,
    cardVersion: DocumentType<CardVersion>,
    user: DocumentType<User>,
    templateName: string
  ): Promise<Stripe.Checkout.Session> {
    const productName = {
      [CardSpecBaseType.Custom]: `Nomus card - custom design (${order.quantity} pack)`,
      [CardSpecBaseType.Template]: `Nomus card - ${templateName} template (${order.quantity} pack)`,
    }[cardVersion.baseType]

    /* eslint-disable camelcase */
    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              images: [cardVersion.frontImageUrl, cardVersion.backImageUrl],
            },
            unit_amount: QUANTITY_TO_PRICE[order.quantity],
          },
          quantity: 1,
          // The TS types don't have dynamic_tax_rates yet but we can use it. This lets
          // us let Stripe Checkout dynamically apply taxes using the tax rates we specify
          // based on the shipping address the user enters
          // See https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items-dynamic_tax_rates
          // @ts-ignore
          dynamic_tax_rates: [
            DEPLOY_ENV === 'production'
              ? 'txr_1J5P6SGTbyReVwro2PPLKDBD'
              : 'txr_1J5P6LGTbyReVwro0YiKRJns',
          ],
        },
      ],
      payment_intent_data: {
        metadata: {
          orderId: order.id,
        },
      },
      customer_email: user.email,
      mode: 'payment',
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      success_url: `${BASE_URL}/card-studio/success?orderId=${order.id}`,
      cancel_url: `${BASE_URL}/card-studio/cancel?orderId=${order.id}`,
      metadata: {
        orderId: order.id,
        cardVersionId: cardVersion.id,
      },
    })
    /* eslint-enable camelcase */
  }

  async uploadCardImages(
    imageFiles: { front: Promise<FileUpload>; back?: Promise<FileUpload> },
    cardVersionId: string
  ) {
    // Upload the front image and put the resulting S3 key on the card version
    const frontImage = await imageFiles.front
    const frontImageUploadResult = await S3.uploadGraphQLFileToS3(
      frontImage,
      `${cardVersionId}/front/${Date.now()}.${frontImage.mimetype.split('/')[1]}`,
      S3.S3AssetCategory.CardVersions
    )

    if (!frontImageUploadResult.isSuccess) {
      throw new Error(`Failed to upload front card image: ${frontImageUploadResult.error}`)
    }

    let backImageUploadResult = null
    if (imageFiles.back) {
      const backImage = await imageFiles.back
      backImageUploadResult = await S3.uploadGraphQLFileToS3(
        backImage,
        `${cardVersionId}/back/${Date.now()}.${backImage.mimetype.split('/')[1]}`,
        S3.S3AssetCategory.CardVersions
      )
      if (!backImageUploadResult.isSuccess) {
        throw new Error('Failed to upload back card image')
      }
    }
    const imageUrls = {
      front: S3.getObjectUrl(frontImageUploadResult.value),
      back: backImageUploadResult ? S3.getObjectUrl(backImageUploadResult.value) : null,
    }

    return imageUrls
  }

  private async createOrUpdateExistingOrder({
    user,
    cardVersion,
    payload,
  }: {
    user: DocumentType<User>
    cardVersion: DocumentType<CardVersion>
    payload: SubmitTemplateOrderInput | SubmitCustomOrderInput
  }): Promise<DocumentType<Order>> {
    const { quantity } = payload

    const costSummary = getCostSummary(quantity)
    if (costSummary == null) {
      throw new Error(
        'Failed to calculate pricing, likely due to an unsupported quantity being used'
      )
    }
    const price: OrderPrice = {
      subtotal: costSummary.subtotal,
      shipping: costSummary.shipping,
      // We don't know the cost of tax yet since that requires knowing the shipping address
      // We'll update this (and total) once Stripe checkout completes, in server/src/api/stripehooks.ts
      tax: costSummary.estimatedTaxes,
      total: costSummary.total,
    }

    let order: DocumentType<Order> | null = null
    // Check if the payload includes the id of a previous Order object
    if (payload.previousOrder) {
      // If so, use that Order (with updates applied) rather than creating a new one
      order = await Order.mongo.findOne({ _id: payload.previousOrder, user: user.id })

      if (!order) {
        throw new Error('Paylod specified a previous order but that order could not be found')
      }

      order.quantity = quantity
      order.price = price
    } else {
      // No previous order existed; create a new one
      order = await Order.mongo.create({
        user: user.id,
        cardVersion: cardVersion.id,
        state: OrderState.Captured,
        quantity,
        price,
      })
    }

    // Create a new Stripe Checkout session regardless of whether a previous one
    // existed since some details may have changed in this submission
    const checkoutSession = await this.createCheckoutSession(
      order,
      cardVersion,
      user,
      'templateName' in payload ? payload.templateName : null
    )

    order.checkoutSession = checkoutSession.id
    order.paymentIntent = checkoutSession.payment_intent as string
    await order.save()
    return order
  }
}
export default OrderResolver
