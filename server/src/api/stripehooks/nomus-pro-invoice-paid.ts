import NomusProSubscription from 'src/models/NomusProSubscription'
import { stripe, Stripe } from 'src/util/stripe'

export default async (event: any) => {
  const invoice = event.data.object as Stripe.Invoice
  const stripeSubscriptionId = invoice.subscription as string

  // Webhook-originated events never have expandable properties expanded so we can be sure it's a string
  // See https://stripe.com/docs/expand#with-webhooks for more details
  if (!stripeSubscriptionId) {
    throw new Error('Nomus Pro Invoice received without stripe subscription id')
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)

  await NomusProSubscription.mongo.updateOne(
    { stripeSubscription: stripeSubscriptionId },
    {
      currentPeriodStartsAt: stripeSubscription.current_period_start,
      currentPeriodEndsAt: stripeSubscription.current_period_end,
    }
  )
}
