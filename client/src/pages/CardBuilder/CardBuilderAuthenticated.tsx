import * as Sentry from '@sentry/react'
import { useStripe } from '@stripe/react-stripe-js'
import * as React from 'react'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { useMutation } from 'src/apollo'
import { LinkOrderToUser } from 'src/apollo/types/LinkOrderToUser'
import { LINK_ORDER_TO_USER_MUTATION } from 'src/pages/CardBuilder/mutations'
import LoadingPage from 'src/pages/LoadingPage'

// This component is used when a user went through Card Builder while logged out,
// got redirected to register or log in, and just got redirected back.
const CardBuilderAuthenticated = () => {
  const stripe = useStripe()
  const history = useHistory()
  const [linkOrderToUser, linkOrderToUserMutationResult] = useMutation<
    LinkOrderToUser
  >(LINK_ORDER_TO_USER_MUTATION, {
    errorPolicy: 'all',
  })
  const { orderId } = useParams<{ orderId?: string | undefined }>()

  const initialize = React.useCallback(async () => {
    if (linkOrderToUserMutationResult.called || stripe == null) {
      return
    }

    if (orderId == null) {
      Sentry.captureException(
        new Error('Landed on /card-studio/authenticated without an orderId'),
      )

      return <Redirect to="/shop" />
    }

    const linkOrderResult = await linkOrderToUser({
      variables: {
        orderId,
      },
    })

    if (linkOrderResult.errors) {
      switch (linkOrderResult.errors[0].extensions?.exception?.code) {
        case 'already-linked':
          // The user is trying to link a CardBuilder order that was already linked
          // This either means a user hit back and accidentally went back to this page
          // or a malicious user is trying to take over an existing order.
          // Either way, we can just redirect to /dashboard and it should be fine.
          return history.push('/dashboard')
        case 'order-not-found':
          return history.push('/shop')
        default:
          // Unexpected error... we should get alerted here
          Sentry.captureException(linkOrderResult.errors)
          return history.push('/shop')
      }
    }

    if (
      linkOrderResult.data &&
      linkOrderResult.data.linkOrderToUser.checkoutSession
    ) {
      // Order successfully linked, redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: linkOrderResult.data.linkOrderToUser.checkoutSession,
      })
      if (result?.error) {
        throw new Error(
          result.error.message ?? 'Unknown error while loading checkout',
        )
      }
    }
  }, [linkOrderToUserMutationResult, stripe, history, linkOrderToUser, orderId])

  React.useEffect(() => {
    if (!linkOrderToUserMutationResult.called) {
      initialize()
    }
  }, [linkOrderToUserMutationResult, initialize])

  return <LoadingPage fullscreen />
}

export default CardBuilderAuthenticated
