import bodyParser from 'body-parser'
import express from 'express'
import { Order } from 'src/models'
import { OrderEventTrigger, OrderState } from 'src/util/enums'
import { STRIPE_WEBHOOK_ENDPOINT_SECRET } from 'src/config'
import { stripe } from 'src/util/stripe'
import { Stripe } from 'stripe'
import { getCostSummary } from 'src/util/pricing'

export const stripeWebhooksRouter = express.Router()

stripeWebhooksRouter.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  let event = req.body
  // Verify the webhook actually came from Stripe
  try {
    event =
      // In tests, we don't need to verify the signature so we'll need to parse
      // the Buffer into JSON ourselves
      process.env.NODE_ENV === 'test'
        ? JSON.parse(event.toString())
        : stripe.webhooks.constructEvent(
            event,
            req.headers['stripe-signature'],
            STRIPE_WEBHOOK_ENDPOINT_SECRET
          )
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message)
    return res.sendStatus(400)
  }

  // Handle the event
  switch (event.type) {
    // Once the checkout session succeeds, we need to mark the Order as paid
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session

      // Grab the orderId from the payment intent's metadata and validate it
      const orderId = checkoutSession.metadata.orderId
      if (!orderId) {
        console.error('Received a payment intent webhook without an orderId in the metadata')
        break
      } else if (!orderId.startsWith(Order.prefix + '_')) {
        console.error(
          'Received a payment intent webhook with an invalid orderId in the metadata: ' + orderId
        )
      }

      const order = await Order.mongo.findById(orderId)

      // Alright, we have an Order and have validated it; let's do our business logic

      // Update all the Order data that we newly received
      order.price.subtotal = checkoutSession.amount_subtotal
      order.price.tax = checkoutSession.total_details.amount_tax
      order.price.total = checkoutSession.amount_total
      order.shippingName = checkoutSession.shipping.name
      order.shippingAddress = {
        line1: checkoutSession.shipping.address.line1,
        line2: checkoutSession.shipping.address.line2,
        city: checkoutSession.shipping.address.city,
        state: checkoutSession.shipping.address.state,
        postalCode: checkoutSession.shipping.address.postal_code,
      }
      await order.save()

      if (order.state !== OrderState.Captured) {
        console.error(
          'Received a payment_intent.succeeded webhook for an order that wasn\'t in the "Captured" state'
        )
      }

      // Transition the order to the Paid state
      const transitionResult = await order.transition(OrderState.Paid, OrderEventTrigger.Payment)
      if (!transitionResult.isSuccess) {
        console.error('Transitioning the order failed with an error: ' + transitionResult.error)
      }
      break
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`)
  }
  // Return a 200 response to acknowledge receipt of the event
  res.send()
})
