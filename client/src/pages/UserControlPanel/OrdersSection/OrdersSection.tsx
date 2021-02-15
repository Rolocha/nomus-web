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
import Button from 'src/components/Button'
import Image from 'src/components/Image'
import ordersEmptyStateSvg from './orders_empty_state.svg'
import { css } from '@emotion/react'

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
          price {
            subtotal
            tax
            shipping
            total
          }
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

  const currentOrders = orders
    .filter((order) => order.state !== OrderState.Fulfilled)
    .sort((a, b) => b.createdAt - a.createdAt)

  const previousOrders = orders
    .filter((order) => order.state === OrderState.Fulfilled)
    .sort((a, b) => b.createdAt - a.createdAt)

  return (
    <Box p={{ _: '24px', md: '48px' }} height="100%" overflowY="scroll">
      {orders.length === 0 && (
        <Box
          display="grid"
          width="100%"
          gridTemplateColumns={{ _: '1fr 10fr 1fr', [bp]: '4fr 4fr 4fr' }}
          gridRowGap="16px"
          justifyItems="center"
          css={css({ textAlign: 'center', '&>*': { gridColumn: '2/3' } })}
        >
          <Text.SectionHeader>
            Looks like it's time to go shopping
          </Text.SectionHeader>
          <Image src={ordersEmptyStateSvg} />
          <Text.Body2>
            There are no orders to see here, but you can fix that.
          </Text.Body2>

          {
            <Button variant="primary" size="big" width="100%" disabled>
              Coming soon...
            </Button>
          }
        </Box>
      )}

      {/* Orders list (hide if mobile-layout and an order is selected) */}
      {orders.length !== 0 && !(selectedOrder != null && !isDesktopLayout) && (
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
