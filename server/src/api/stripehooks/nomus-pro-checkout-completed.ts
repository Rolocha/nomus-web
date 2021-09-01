import NomusProSubscription from 'src/models/NomusProSubscription'
import { NomusProFeature } from 'src/util/enums'
import { stripe, Stripe } from 'src/util/stripe'

export default async (event: any) => {
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  if (!checkoutSession.metadata.userId) {
    throw new Error('Missing userId')
  }

  // Webhook-originated events never have expandable properties expanded so we can be sure it's a string
  // See https://stripe.com/docs/expand#with-webhooks for more details
  const stripeSubscriptionId = checkoutSession.subscription as string
  if (!stripeSubscriptionId) {
    throw new Error(
      'Received a Nomus Pro checkout completed webhook with an empty `subscription` property'
    )
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)

  const userId = checkoutSession.metadata.userId
  const triggerFeature = checkoutSession.metadata.triggerFeature as NomusProFeature | null

  const userAlreadyHasSubscription = await NomusProSubscription.mongo.exists({
    user: userId,
  })
  if (userAlreadyHasSubscription) {
    // Uh... idk what we should do here, this probably shouldn't ever happen
    throw new Error(
      'Received a Nomus pro checkout completed webhook for a user ID that already has a subscription'
    )
  }

  // Create an instance of the NomusProSubscription model on our end
  await NomusProSubscription.mongo.create({
    user: userId,
    originalCheckoutSession: checkoutSession.id,
    stripeSubscription: stripeSubscriptionId,
    currentPeriodStartsAt: stripeSubscription.current_period_start,
    currentPeriodEndsAt: stripeSubscription.current_period_end,
    // Auto-enable the feature that prompted the user to subscribe
    featureSet: {
      [NomusProFeature.UseCustomTapLink]: triggerFeature === NomusProFeature.UseCustomTapLink,
    },
  } as NomusProSubscription)
}
