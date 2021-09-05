import { Redirect, useParams } from 'react-router-dom'

// This means the user landed here after a successful Stripe Checkout payment + redirection.
// The URL would have an orderId param on it so we can use that to redirect them to the
// order detail view for this completed order.
const CardBuilderSuccessfulCheckout = () => {
  const { orderId } = useParams<{ orderId?: string | undefined }>()
  if (orderId == null) {
    return <Redirect to="/shop" />
  }
  return <Redirect to={`/dashboard/orders/${orderId}`} />
}

export default CardBuilderSuccessfulCheckout
