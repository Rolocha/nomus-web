import { Order } from 'src/models'
import { OrderEventTrigger, OrderState } from 'src/util/enums'
import { Stripe } from 'stripe'

export default async (event: any) => {
  const checkoutSession = event.data.object as Stripe.Checkout.Session

  // Grab the orderId from the payment intent's metadata and validate it
  const orderId = checkoutSession.metadata.orderId
  if (!orderId) {
    console.error('Received a payment intent webhook without an orderId in the metadata')
    return
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
  const transitionResult = await order.transition(OrderState.Actionable, OrderEventTrigger.Payment)
  if (!transitionResult.isSuccess) {
    console.error('Transitioning the order failed with an error: ' + transitionResult.error)
  }
}
