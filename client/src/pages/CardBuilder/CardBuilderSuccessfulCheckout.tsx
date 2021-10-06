import { Redirect, useParams } from 'react-router-dom'
import { gql, useQuery } from 'src/apollo'
import { CardBuilderConfirmationScreenQuery } from 'src/apollo/types/CardBuilderConfirmationScreenQuery'
import ConfirmationPage from 'src/pages/CardBuilder/ConfirmationPage'
import LoadingPage from 'src/pages/LoadingPage'

// This means the user landed here after a successful Stripe Checkout payment + redirection.
// The URL would have an orderId param on it so we can use that to redirect them to the
// order detail view for this completed order.
const CardBuilderSuccessfulCheckout = () => {
  const { orderId } = useParams<{ orderId?: string | undefined }>()

  const { loading, data, error } = useQuery<CardBuilderConfirmationScreenQuery>(
    gql`
      query CardBuilderConfirmationScreenQuery($orderId: String!) {
        order(orderId: $orderId) {
          id
          createdAt
          shortId
          shippingName
          shippingAddress {
            line1
            line2
            city
            state
            postalCode
          }
          cardVersion {
            frontImageUrl
            backImageUrl
          }
          quantity
          price {
            total
          }
          user {
            email
            name {
              first
            }
          }
        }
      }
    `,
    {
      variables: { orderId },
      skip: orderId == null,
    },
  )

  if (orderId == null) {
    return <Redirect to="/shop" />
  }

  if (loading) {
    return <LoadingPage fullscreen />
  }

  const order = data?.order
  if (!order || error) {
    return <Redirect to="/" />
  }

  return <ConfirmationPage order={order} />
}

export default CardBuilderSuccessfulCheckout
