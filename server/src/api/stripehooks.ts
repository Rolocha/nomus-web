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

      if (order.state !== OrderState.Captured) {
        console.error(
          'Received a payment_intent.succeeded webhook for an order that wasn\'t in the "Captured" state'
        )
      }

      // Alright, we have an Order and have validated it; let's do our business logic
      const transitionResult = await order.transition(OrderState.Paid, OrderEventTrigger.Payment)

      // Update Order.price now that we know tax details
      order.price.subtotal = checkoutSession.amount_subtotal
      order.price.tax = checkoutSession.total_details.amount_tax
      order.price.total = checkoutSession.amount_total

      const updatedCostSummary = getCostSummary(
        order.quantity,
        checkoutSession.shipping.address.state
      )
      if (updatedCostSummary.total !== checkoutSession.amount_total) {
        // Just drop some error logs to catch potential bugs with our costSummary method
        console.error(
          `Mismatch between total from Stripe checkout session ${checkoutSession.id} (${checkoutSession.amount_total}) and calculated cost summary (${updatedCostSummary.total})`
        )
      }

      // Save shipping info
      order.shippingAddress = {
        line1: checkoutSession.shipping.address.line1,
        line2: checkoutSession.shipping.address.line2,
        state: checkoutSession.shipping.address.state,
        city: checkoutSession.shipping.address.city,
        postalCode: checkoutSession.shipping.address.postal_code,
      }
      order.shippingName = checkoutSession.shipping.name

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
