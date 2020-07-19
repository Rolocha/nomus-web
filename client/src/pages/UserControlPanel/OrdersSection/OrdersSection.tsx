import * as React from 'react'
import { gql, useQuery } from 'src/apollo'
import { OrderState } from 'src/apollo/types/globalTypes'
import { UCPOrdersSectionQuery } from 'src/apollo/types/UCPOrdersSectionQuery'
import Box from 'src/components/Box'
import Modal from 'src/components/Modal'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import OrderList from './OrderList'
import { useParams, useHistory } from 'react-router-dom'
import OrderDetailView from './OrderDetailView'
import { useBreakpoint } from 'src/styles/breakpoints'

interface URLParams {
  orderId?: string
}

const bp = 'md'

export default () => {
  const params = useParams<URLParams>()
  const history = useHistory()
  const { loading, data } = useQuery<UCPOrdersSectionQuery>(
    gql`
      query UCPOrdersSectionQuery {
        orders {
          id
          cardVersion {
            frontImageUrl
            backImageUrl
          }
          price
          quantity
          state
          createdAt
          trackingNumber
        }
      }
    `,
  )
  const isDesktopLayout = useBreakpoint(bp)

  if (loading || !data) {
    return <LoadingPage />
  }

  const { orders } = data
  if (orders == null) {
    return null
  }

  const selectedOrder = orders.find((order) => order.id === params.orderId)

  const currentOrders = orders.filter(
    (order) => order.state !== OrderState.Fulfilled,
  )
  const previousOrders = orders.filter(
    (order) => order.state === OrderState.Fulfilled,
  )

  return (
    <Box>
      {/* Orders list (hide if mobile-layout and an order is selected) */}
      {!(selectedOrder != null && !isDesktopLayout) && (
        <Box>
          <Text.H3 mb={3}>Current orders</Text.H3>
          <OrderList orders={currentOrders} />

          {previousOrders.length > 0 && (
            <Box>
              <Text.H3 mt="40px" mb={3}>
                Previous orders
              </Text.H3>
              <OrderList orders={previousOrders} />
            </Box>
          )}
        </Box>
      )}

      {/* Desktop-only selected order modal */}
      {isDesktopLayout && (
        <Modal
          isOpen={params.orderId != null}
          onClose={() => history.push('/dashboard/orders')}
          anchorStyle="right"
        >
          {selectedOrder && <OrderDetailView order={selectedOrder} />}
        </Modal>
      )}

      {/* Mobile-only selected order "page" */}
      {!isDesktopLayout && selectedOrder && (
        <Box>{selectedOrder && <OrderDetailView order={selectedOrder} />}</Box>
      )}
    </Box>
  )
}
