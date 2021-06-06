import bodyParser from 'body-parser'
import express from 'express'
import { Order } from 'src/models'
import { OrderEventTrigger, OrderState } from 'src/util/enums'
import { STRIPE_WEBHOOK_ENDPOINT_SECRET } from 'src/config'
import { stripe } from 'src/util/stripe'

export const stripeWebhooksRouter = express.Router()

stripeWebhooksRouter.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  let event = req.body
  // Verify the webhook actually came from Stripe
  try {
    event = stripe.webhooks.constructEvent(
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
    // Once a payment intent succeeds, we need to mark the Order as paid
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object

      // Grab the orderId from the payment intent's metadata and validate it
      const orderId = paymentIntent.metadata.orderId
      if (!orderId) {
        console.error('Received a payment intent webhook without an orderId in the metadata')
        break
      } else if (!orderId.startsWith(Order.prefix + '_')) {
        console.error(
          'Received a payment intent webhook with an invalid orderId in the metadata: ' + orderId
        )
      }

      const order = await Order.mongo.findById(orderId)

      if (order.state !== OrderState.Captured) {
        console.error(
          'Received a payment_intent.succeeded webhook for an order that wasn\'t in the "Captured" state'
        )
      }

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
