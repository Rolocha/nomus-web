import { DocumentType } from '@typegoose/typegoose'
import { GraphQLUpload, UserInputError } from 'apollo-server-express'
import { FileUpload } from 'graphql-upload'
import { BASE_URL, DEPLOY_ENV } from 'src/config'
import { IApolloContext } from 'src/graphql/types'
import { CardVersion, Order } from 'src/models'
import { Void } from 'src/models/scalars'
import {
  Address,
  OrderPrice,
  PersonName,
  TemplateColorScheme,
  TemplateContactInfoFields,
} from 'src/models/subschemas'
import { User } from 'src/models/User'
import { performTransaction } from 'src/util/db'
import {
  CardSpecBaseType,
  OrderCreatedBy,
  OrderEventTrigger,
  OrderState,
  Role,
  VISIBLE_ORDER_LIST_STATES,
} from 'src/util/enums'
import { getCostSummary, QUANTITY_TO_PRICE } from 'src/util/pricing'
import * as S3 from 'src/util/s3'
import { Stripe, stripe } from 'src/util/stripe'
import { getTemplateName } from 'src/util/templates'
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

@InputType({
  description: 'Input to generate new Order object, regardless of what type of card base was used',
})
class BaseSubmitOrderInput {
  @Field({ nullable: true })
  orderId: string | null

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
  name?: PersonName | null

  @Field({ nullable: false })
  quantity: number

  @Field((type) => Address, { nullable: false })
  shippingAddress: Address

  @Field((type) => OrderPrice, { nullable: true })
  price?: OrderPrice | null

  @Field({ nullable: true })
  paymentIntent?: string | null

  @Field({
    nullable: true,
    defaultValue: false,
    description:
      "Whether to skip updating the user's default card version to the one created in this order",
  })
  skipDefaultCardVersionUpdate: boolean
}

@ObjectType()
class SubmitOrderResponse {
  @Field({ nullable: true })
  checkoutSession: string | null

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

  // Get a single order
  @Authorized(Role.User)
  @Query(() => Order, { nullable: false })
  async order(
    @Arg('orderId', { nullable: true }) orderId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<Order | Error> {
    // An admin can query for any order while a non-admin can only
    // query for orders corresponding to their user ID
    const findQuery = context.user.roles.includes(Role.Admin)
      ? {
          _id: orderId,
        }
      : {
          _id: orderId,
          user: context.user.id,
        }
    const order = await Order.mongo.findOne(findQuery)
    if (order == null) {
      throw new UserInputError(`No order found with ID: ${orderId}`)
    }
    return order
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
  @Query(() => [Order], { nullable: true })
  async userOrders(@Ctx() context: IApolloContext): Promise<Order[]> {
    return Order.mongo
      .find({
        user: context.user._id,
        state: {
          $in: VISIBLE_ORDER_LIST_STATES,
        },
      })
      .populate('cardVersion')
  }

  // No @Authorized() decorator - we want a logged-out client to be able to
  // call this mutation to initialize Card Builder
  @Mutation(() => Order, {
    description:
      'Initializes a new order and associated card version for use in the Card Builder UI',
  })
  async createEmptyOrderForCardBuilder(
    @Arg('baseType', () => CardSpecBaseType, { nullable: false }) baseType: CardSpecBaseType,
    @Ctx() context: IApolloContext
  ) {
    const cardVersion = await CardVersion.mongo.create({
      baseType,
      user: context.user?.id ?? undefined,
    })
    return Order.mongo.create({
      cardVersion,
    })
  }

  @Authorized(Role.User)
  @Mutation(() => SubmitOrderResponse, {
    description: 'Links an orphan order to a user',
  })
  async linkOrderToUser(
    @Arg('orderId', { nullable: false }) orderId: string,
    @Ctx() context: IApolloContext
  ): Promise<SubmitOrderResponse> {
    const user = context.user
    if (user == null) {
      throw new UnauthorizedError()
    }

    const order = await Order.mongo.findById(orderId).populate('cardVersion')
    if (order == null) {
      throw new UserInputError(`No order found with that ID: ${orderId}`, {
        code: 'order-not-found',
      })
    }

    if (order.user) {
      throw new UserInputError('This card has already been linked!', {
        code: 'already-linked',
      })
    }

    order.user = user.id
    const cardVersion = order.cardVersion as DocumentType<CardVersion>
    cardVersion.user = user.id

    await Promise.all([order.save(), cardVersion.save()])

    // Create a new Stripe Checkout session regardless of whether a previous one
    // existed since some details may have changed in this submission
    const checkoutSession = await this.createCheckoutSession(order, cardVersion, user)
    order.checkoutSession = checkoutSession.id
    order.paymentIntent = checkoutSession.payment_intent as string

    return {
      checkoutSession: order.checkoutSession,
      orderId: order.id,
    }
  }

  // No @Authorized() decorator - we want a logged-out client to be able to
  // call this mutation to submit Card Builder
  @Mutation((type) => SubmitOrderResponse, {
    description:
      'Handles submission of an order created via the Card Builder UI for a custom user design',
  })
  async submitCustomOrder(
    @Arg('payload', { nullable: false }) payload: SubmitCustomOrderInput,
    @Ctx() context: IApolloContext
  ): Promise<SubmitOrderResponse> {
    const user: DocumentType<User> | undefined = context.user

    return this.submitCardBuilderOrderCommon(user, payload, async () => {
      const cardVersion = new CardVersion.mongo({
        user: user?.id,
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
      return cardVersion
    })
  }

  // No @Authorized() decorator - we want a logged-out client to be able to
  // call this mutation to submit Card Builder
  @Mutation((type) => SubmitOrderResponse, {
    description:
      'Handles submission of an order created via the Card Builder UI for a template-based design',
  })
  async submitTemplateOrder(
    @Arg('payload', { nullable: false }) payload: SubmitTemplateOrderInput,
    @Ctx() context: IApolloContext
  ): Promise<SubmitOrderResponse> {
    const user: DocumentType<User> | undefined = context.user

    return this.submitCardBuilderOrderCommon(user, payload, async () => {
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

      return cardVersion
    })
  }

  @Authorized(Role.Admin)
  @Mutation((type) => Void, {
    nullable: true,
    description:
      'updates the print spec of an order, used in admin panel on update of front and back card',
  })
  async updatePrintSpec(@Arg('orderId', { nullable: false }) orderId: string): Promise<void> {
    const order = await Order.mongo.findById(orderId)
    await order.updatePrintSpecPDF()
  }

  @Authorized(Role.Admin)
  @Mutation((type) => Order, {
    description: 'Handles manual submission of an order from admin panel',
  })
  async submitManualOrder(
    @Arg('payload', { nullable: false }) payload: ManualOrderInput
  ): Promise<Order> {
    const { email, name, price: payloadPrice, quantity, shippingAddress } = payload
    const user = await User.getOrCreateUser(email, name)

    const price = payloadPrice ?? this.calculateOrderPrice(quantity, shippingAddress.state)

    const cv = await CardVersion.mongo.create({
      user: user.id,
      baseType: CardSpecBaseType.Custom,
    })

    const order = await Order.mongo.create({
      user: user.id,
      cardVersion: cv.id,
      state: OrderState.Actionable,
      quantity,
      price,
      shippingAddress,
      shippingName: user.fullName,
      paymentIntent: payload.paymentIntent,
      createdBy: OrderCreatedBy.Manual,
    })

    if (!payload.skipDefaultCardVersionUpdate) {
      user.defaultCardVersion = cv.id
      await user.save()
    }

    return order
  }

  /**
   * Private helpers
   */

  // Handles the base-type-agnostic logic for submitting an order from Card Studio
  // The `createCardVersion` parameter expects the caller to create a CardVersion,
  // the process for which _is_ base-type specific
  private async submitCardBuilderOrderCommon(
    user: DocumentType<User>,
    payload: SubmitTemplateOrderInput | SubmitCustomOrderInput,
    createCardVersion: () => Promise<DocumentType<CardVersion>>,
    shippingState?: string
  ): Promise<SubmitOrderResponse> {
    await this.validateCardBuilderOrderCommon(payload)
    const { orderId, quantity } = payload
    const cardVersion = await createCardVersion()

    const price = this.calculateOrderPrice(quantity, shippingState)

    // Update the Order corresponding to the payload orderId if it exists
    // Else create a new Order with those details
    const order = await Order.mongo.findOneAndUpdate(
      {
        _id: orderId ?? Order.mongo.createId(),
      },
      {
        user: user?.id,
        cardVersion: cardVersion.id,
        quantity,
        price,
        createdBy: OrderCreatedBy.CardBuilder,
      },
      {
        upsert: true,
      }
    )

    await order.transition(OrderState.Captured)
    await order.updatePrintSpecPDF()

    if (user) {
      // Update the user's default card version to the newly created one
      user.defaultCardVersion = cardVersion.id
      await user.save()

      // Create a new Stripe Checkout session regardless of whether a previous one
      // existed since some details may have changed in this submission
      // Note that the client is responsible for making sure that a `user` is present (i.e.
      // user is logged in) before we're able to create/redirect to a Stripe Checkout session
      const checkoutSession = await this.createCheckoutSession(order, cardVersion, user)
      order.checkoutSession = checkoutSession.id
      order.paymentIntent = checkoutSession.payment_intent as string
      await order.save()
    }

    return {
      orderId: order.id,
      checkoutSession: order.checkoutSession,
    }
  }

  private async validateCardBuilderOrderCommon(payload: BaseSubmitOrderInput) {
    if (payload.orderId) {
      const isValidPreviousOrder = await Order.mongo.exists({ _id: payload.orderId })
      if (!isValidPreviousOrder) {
        throw new Error(
          `Invalid previous order: could not find an order with id ${payload.orderId}`
        )
      }
    }
    if (payload.quantity % 25 !== 0) {
      throw new Error('Invalid quantity: not a multiple of 25')
    }
  }

  // Creates a Checkout Session
  private async createCheckoutSession(
    order: DocumentType<Order>,
    cardVersion: DocumentType<CardVersion>,
    user: DocumentType<User>
  ): Promise<Stripe.Checkout.Session> {
    const templateName = getTemplateName(cardVersion.templateId)
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
      success_url: `${BASE_URL}/card-studio/success/${order.id}`,
      cancel_url: `${BASE_URL}/card-studio/cancel/${order.id}`,
      metadata: {
        orderId: order.id,
        cardVersionId: cardVersion.id,
      },
    })
    /* eslint-enable camelcase */
  }

  private async uploadCardImages(
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

  private calculateOrderPrice(quantity: number, state?: string): OrderPrice {
    const costSummary = getCostSummary(quantity, state)
    if (costSummary == null) {
      throw new Error(
        'Failed to calculate pricing, likely due to an unsupported quantity being used'
      )
    }
    return {
      subtotal: costSummary.subtotal,
      shipping: costSummary.shipping,
      // We don't know the cost of tax yet since that requires knowing the shipping address
      // We'll update this (and total) once Stripe checkout completes, in server/src/api/stripehooks.ts
      tax: costSummary.estimatedTaxes,
      discount: costSummary.discount,
      total: costSummary.total,
    }
  }
}
export default OrderResolver
