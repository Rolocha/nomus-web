import { Order } from 'src/models'
import NomusProSubscription from 'src/models/NomusProSubscription'
import { OrderEventTrigger, OrderState } from 'src/util/enums'
import { stripe, Stripe } from 'src/util/stripe'

export default async (event: any) => {
  const invoice = event.data.object as Stripe.Invoice
  const stripeSubscriptionId = invoice.subscription as string

  // Webhook-originated events never have expandable properties expanded so we can be sure it's a string
  // See https://stripe.com/docs/expand#with-webhooks for more details
  if (stripeSubscriptionId) {
    const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)

    await NomusProSubscription.mongo.updateOne(
      { stripeSubscription: stripeSubscriptionId },
      {
        currentPeriodStartsAt: stripeSubscription.current_period_start,
        currentPeriodEndsAt: stripeSubscription.current_period_end,
      }
    )
  } else {
    const paymentIntent = (invoice.payment_intent as Stripe.PaymentIntent).id
    const relatedOrder = await Order.mongo.findOne({ paymentIntent })
    if (!relatedOrder) {
      throw new Error('Received an invoice paid webhook with no related order or subscription ID')
    }
    await relatedOrder.transition(OrderState.Paid, OrderEventTrigger.Payment)
  }
}
