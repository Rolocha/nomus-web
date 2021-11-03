import * as React from 'react'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { gql, useQuery } from 'src/apollo'
import { OrderState } from 'src/apollo/types/globalTypes'
import { UCPOrdersSectionQuery } from 'src/apollo/types/UCPOrdersSectionQuery'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import Link from 'src/components/Link'
import Modal from 'src/components/Modal'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { useBreakpoint } from 'src/styles/breakpoints'
import OrderDetailView from './OrderDetailView'
import OrderList from './OrderList'
import ordersEmptyStateSvg from './orders_empty_state.svg'

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
        userOrders {
          id
          shortId
          cardVersion {
            frontImageUrl
            backImageUrl
          }
          price {
            subtotal
            tax
            shipping
            discount
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

  const { userOrders } = data
  if (userOrders == null) {
    return null
  }

  const currentOrders = userOrders
    .filter((order) => order.state !== OrderState.Fulfilled)
    .sort((a, b) => b.createdAt - a.createdAt)

  const previousOrders = userOrders
    .filter((order) => order.state === OrderState.Fulfilled)
    .sort((a, b) => b.createdAt - a.createdAt)

  const selectedOrder = userOrders.find(
    (order) => order.id === params.orderId || order.shortId === params.orderId,
  )

  if (params.orderId && selectedOrder == null) {
    return <Redirect to="/dashboard/orders" />
  }

  return (
    <Box p={{ base: '24px', md: '48px' }} height="100%">
      {userOrders.length === 0 && (
        <Box
          display="grid"
          width="100%"
          gridTemplateColumns={{ base: '1fr 10fr 1fr', [bp]: '4fr 4fr 4fr' }}
          gridRowGap="16px"
          justifyItems="center"
          textAlign="center"
          sx={{ '&>*': { gridColumn: '2/3' } }}
        >
          <Text.SectionHeader>
            Looks like it's time to go shopping
          </Text.SectionHeader>
          <Image src={ordersEmptyStateSvg} />
          <Text.Body2>
            There are no orders to see here, but you can fix that.
          </Text.Body2>

          <Link
            variant="primary"
            size="big"
            width="100%"
            buttonStyle="primary"
            buttonSize="big"
            to="/shop"
          >
            Let's build a Nomus card
          </Link>
        </Box>
      )}

      {/* Orders list (hide if mobile-layout and an order is selected) */}
      {userOrders.length !== 0 && !(selectedOrder != null && !isDesktopLayout) && (
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
          {selectedOrder && <OrderDetailView orderId={selectedOrder.id} />}
        </Modal>
      )}

      {/* Mobile-only selected order "page" */}
      {!isDesktopLayout && selectedOrder && (
        <Box>
          {selectedOrder && <OrderDetailView orderId={selectedOrder.id} />}
        </Box>
      )}
    </Box>
  )
}
