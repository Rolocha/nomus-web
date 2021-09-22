import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'src/apollo'
import { LoadExistingCardBuilderOrder } from 'src/apollo/types/LoadExistingCardBuilderOrder'
import { createCardBuilderStateFromExistingOrder } from 'src/pages/CardBuilder/card-builder-state'
import { LOAD_EXISTING_CARD_BUILDER_ORDER } from 'src/pages/CardBuilder/mutations'
import { CardBuilderLocationState } from 'src/pages/CardBuilder/card-builder-state'
import LoadingPage from 'src/pages/LoadingPage'

// If the user canceled the order from an external location (currently
// this would just be Stripe Checkout), we'll need to fetch the order
// from our backend and rebuild a CardBuilder State instance using it
const CardBuilderCanceledCheckout = () => {
  const history = useHistory<CardBuilderLocationState>()
  const { orderId } = useParams<{ orderId?: string | undefined }>()
  const { data: existingOrderData, ...loadExistingOrderQuery } = useQuery<
    LoadExistingCardBuilderOrder
  >(LOAD_EXISTING_CARD_BUILDER_ORDER, {
    skip: !orderId,
    variables: {
      orderId,
    },
    errorPolicy: 'all',
  })

  const initialize = React.useCallback(async () => {
    if (!loadExistingOrderQuery.called || loadExistingOrderQuery.loading) {
      return null
    }

    const existingOrder = existingOrderData?.order
    if (!existingOrder) {
      return history.push('/shop')
    }

    // Build up the card builder state from the order specified in the orderId search param
    const cardBuilderStateFromBefore = await createCardBuilderStateFromExistingOrder(
      existingOrder,
    )

    history.push(
      `/card-studio/${existingOrder.cardVersion.baseType.toLowerCase()}`,
      {
        cardBuilderState: cardBuilderStateFromBefore,
      },
    )
  }, [loadExistingOrderQuery, history, existingOrderData])

  React.useEffect(() => {
    if (!loadExistingOrderQuery.called) {
      initialize()
    }
  }, [loadExistingOrderQuery, initialize])

  return <LoadingPage fullscreen />
}

export default CardBuilderCanceledCheckout
