import * as Sentry from '@sentry/react'
import { useStripe } from '@stripe/react-stripe-js'
import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { useMutation } from 'src/apollo'
import { LinkOrderToUser } from 'src/apollo/types/LinkOrderToUser'
import { LINK_ORDER_TO_USER_MUTATION } from 'src/pages/CardBuilder/mutations'
import LoadingPage from 'src/pages/LoadingPage'

// This component is used when a user went through Card Builder while logged out,
// got redirected to register or log in, and just got redirected back.
const CardBuilderAuthenticated = () => {
  const stripe = useStripe()
  const [linkOrderToUser, linkOrderToUserMutationResult] = useMutation<
    LinkOrderToUser
  >(LINK_ORDER_TO_USER_MUTATION, {
    errorPolicy: 'all',
  })
  const { orderId } = useParams<{ orderId?: string | undefined }>()

  const initialize = React.useCallback(async () => {
    if (linkOrderToUserMutationResult.called) {
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
      throw new Error(linkOrderResult.errors[0].message)
    }

    if (
      linkOrderResult.data &&
      linkOrderResult.data.linkOrderToUser.checkoutSession
    ) {
      // Order successfully linked, redirect to Stripe Checkout so we can get that moola
      const result = await stripe?.redirectToCheckout({
        sessionId: linkOrderResult.data.linkOrderToUser.checkoutSession,
      })
      if (result?.error) {
        throw new Error(
          result.error.message ?? 'Unknown error while loading checkout',
        )
      }
    }
  }, [linkOrderToUserMutationResult, stripe, linkOrderToUser, orderId])

  React.useEffect(() => {
    if (!linkOrderToUserMutationResult.called) {
      initialize()
    }
  }, [linkOrderToUserMutationResult, initialize])

  return <LoadingPage fullscreen />
}

export default CardBuilderAuthenticated
