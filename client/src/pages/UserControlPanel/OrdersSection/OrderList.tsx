import 'css.gg/icons/css/chevron-right.css'
import * as React from 'react'
import { useLocation } from 'react-router-dom'
import Box from 'src/components/Box'
import CopyableText from 'src/components/CopyableText'
import Icon from 'src/components/Icon'
import Link from 'src/components/Link'
import * as Text from 'src/components/Text'
import { Order } from 'src/types/order'
import { getFormattedFullDate } from 'src/utils/date'
import { formatDollarAmount } from 'src/utils/money'
import { getUserFacingOrderState } from 'src/utils/order'

interface Props {
  orders: Array<Order>
}

const shortenOrderId = (orderId: string) => {
  const id = orderId.split('_')[1]
  return [id.substr(0, 4), id.substr(-4)].join('...')
}

const bp = 'md'

const OrderList = ({ orders }: Props) => {
  const location = useLocation()
  const rowStyles = {
    display: 'grid',
    gridTemplateColumns: {
      base: '5fr 4fr 3fr',
      // Hard coding the required pixel values for known long entities like date, tracking #, "View order" button
      [bp]: '180px 2fr 200px 140px 1fr 100px',
    },
    gridTemplateAreas: {
      base: `
        "orderDate status price"
        "orderNumber trackingNumber trackingNumber"
        "viewOrder viewOrder viewOrder"
      `,
      [bp]: `"orderDate status orderNumber trackingNumber price viewOrder"`,
    },
    gridRowGap: { base: 2, [bp]: 0 },
    gridColumnGap: { base: 2, [bp]: 3 },
    px: 3,
  }

  return (
    <Box>
      {/* Header row (only visible in large-width layout) */}
      <Box {...rowStyles} mb={2} display={{ base: 'none', [bp]: 'grid' }}>
        {/* Sorta hacky, but this column is the only one where the label doesn't abide by the same grid spacing + padding as the rows so the -3 margin-left helps push it back to the front */}
        <Box gridArea="orderDate" ml={-3}>
          <Text.Label>Ordered On</Text.Label>
        </Box>
        <Box gridArea="status">
          <Text.Label>Status</Text.Label>
        </Box>
        <Box gridArea="orderNumber">
          <Text.Label>Order #</Text.Label>
        </Box>
        <Box gridArea="trackingNumber">
          <Text.Label>Tracking #</Text.Label>
        </Box>
        <Box gridArea="price">
          <Text.Label>Price</Text.Label>
        </Box>
        <Box gridArea="viewOrder"></Box>
      </Box>

      {orders.map((order, index) => {
        return (
          <Box
            key={order.id}
            borderRadius="lg"
            borderWidth={1}
            borderStyle="solid"
            borderColor="africanElephant"
            pt={{ base: 3, [bp]: 3 }}
            pb={{ base: 0, [bp]: 3 }}
            mb={index === orders.length - 1 ? 0 : 2}
            {...rowStyles}
            alignItems="center"
          >
            <Box gridArea="orderDate">
              <Box display={{ base: 'block', [bp]: 'none' }}>
                <Text.Label>Ordered On</Text.Label>
              </Box>
              <Text.Body2>{getFormattedFullDate(order.createdAt)}</Text.Body2>
            </Box>
            <Box gridArea="status">
              <Box display={{ base: 'block', [bp]: 'none' }}>
                <Text.Label>Status</Text.Label>
              </Box>
              <Text.Body2>{getUserFacingOrderState(order.state)}</Text.Body2>
            </Box>
            <Box gridArea="orderNumber" placeSelf="center start">
              <Box display={{ base: 'block', [bp]: 'none' }}>
                <Text.Label>Order #</Text.Label>
              </Box>
              <Text.Body2>
                <CopyableText copyText={order.id}>
                  {shortenOrderId(order.id)}
                </CopyableText>
              </Text.Body2>
            </Box>
            <Box gridArea="trackingNumber">
              <Box display={{ base: 'block', [bp]: 'none' }}>
                <Text.Label>Tracking #</Text.Label>
              </Box>
              <Text.Body2>
                <Link
                  to={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`}
                >
                  {order.trackingNumber}
                </Link>
              </Text.Body2>
            </Box>
            <Box gridArea="price">
              <Box display={{ base: 'block', [bp]: 'none' }}>
                <Text.Label>Price</Text.Label>
              </Box>
              <Text.Body2>
                {order.price ? formatDollarAmount(order.price.total) : '-'}
              </Text.Body2>
            </Box>

            <Box
              gridArea="viewOrder"
              borderTopColor="superlightGray"
              borderTopStyle="solid"
              borderTopWidth={{ base: 1, [bp]: 0 }}
              placeSelf={{ base: 'stretch', [bp]: 'unset' }}
              textAlign="center"
              // This ensures the top-border reaches the edges even though there's padding in the parent
              mx={-rowStyles.px}
              py={{ base: 2, [bp]: 0 }}
            >
              <Link
                to={`${location.pathname}/${order.id}`}
                buttonStyle="tertiary"
                sx={{
                  // We don't want all the extra button padding in this case
                  padding: 'unset',
                  display: 'inline-block',
                  // Override default on-hover styles for this particular case
                  // Medium-bold the text rather than using the light blue background
                  '&:hover': {
                    background: 'none',
                    p: {
                      fontWeight: 500,
                    },
                  },
                }}
              >
                <Box display="flex" alignItems="center">
                  <Text.Body3 color="secondaryBlue">View order</Text.Body3>
                  <Icon of="chevronRight" />
                </Box>
              </Link>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default OrderList
