import { css } from '@emotion/core'
import 'css.gg/icons/css/chevron-right.css'
import * as React from 'react'
import { useLocation } from 'react-router-dom'
import Box from 'src/components/Box'
import CopyableText from 'src/components/CopyableText'
import Icon from 'src/components/Icon'
import { ExternalLink, InternalLink } from 'src/components/Link'
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
      _: '5fr 4fr 3fr',
      // Hard coding the required pixel values for known long entities like date, tracking #, "View order" button
      [bp]: '180px 2fr 200px 140px 1fr 100px',
    },
    gridTemplateAreas: {
      _: `
        "orderDate status price"
        "orderNumber trackingNumber trackingNumber"
        "viewOrder viewOrder viewOrder"
      `,
      [bp]: `"orderDate status orderNumber trackingNumber price viewOrder"`,
    },
    gridRowGap: { _: 2, [bp]: 0 },
    gridColumnGap: { _: 2, [bp]: 3 },
    px: 3,
  }

  return (
    <Box>
      {/* Header row (only visible in large-width layout) */}
      <Box {...rowStyles} mb={2} display={{ _: 'none', [bp]: 'grid' }}>
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
            borderRadius={2}
            borderWidth={1}
            borderStyle="solid"
            borderColor="africanElephant"
            pt={{ _: 3, [bp]: 3 }}
            pb={{ _: 0, [bp]: 3 }}
            mb={index === orders.length - 1 ? 0 : 2}
            {...rowStyles}
            alignItems="center"
          >
            <Box gridArea="orderDate">
              <Box display={{ _: 'block', [bp]: 'none' }}>
                <Text.Label>Ordered On</Text.Label>
              </Box>
              <Text.Body2>{getFormattedFullDate(order.createdAt)}</Text.Body2>
            </Box>
            <Box gridArea="status">
              <Box display={{ _: 'block', [bp]: 'none' }}>
                <Text.Label>Status</Text.Label>
              </Box>
              <Text.Body2>{getUserFacingOrderState(order)}</Text.Body2>
            </Box>
            <Box gridArea="orderNumber" placeSelf="center start">
              <Box display={{ _: 'block', [bp]: 'none' }}>
                <Text.Label>Order #</Text.Label>
              </Box>
              <Text.Body2>
                <CopyableText copyText={order.id}>
                  {shortenOrderId(order.id)}
                </CopyableText>
              </Text.Body2>
            </Box>
            <Box gridArea="trackingNumber">
              <Box display={{ _: 'block', [bp]: 'none' }}>
                <Text.Label>Tracking #</Text.Label>
              </Box>
              {/* TODO: Figure out where to actually link this */}

              <Text.Body2>
                <ExternalLink href="#">{order.trackingNumber}</ExternalLink>
              </Text.Body2>
            </Box>
            <Box gridArea="price">
              <Box display={{ _: 'block', [bp]: 'none' }}>
                <Text.Label>Price</Text.Label>
              </Box>
              <Text.Body2>{formatDollarAmount(order.price.total)}</Text.Body2>
            </Box>

            <Box
              gridArea="viewOrder"
              borderTopColor="superlightGray"
              borderTopStyle="solid"
              borderTopWidth={{ _: 1, [bp]: 0 }}
              placeSelf={{ _: 'stretch', [bp]: 'unset' }}
              textAlign="center"
              // This ensures the top-border reaches the edges even though there's padding in the parent
              mx={-rowStyles.px}
              py={{ _: 2, [bp]: 0 }}
            >
              <InternalLink
                to={`${location.pathname}/${order.id}`}
                asButton
                buttonStyle="tertiary"
                css={css({
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
                })}
              >
                <Box display="flex" alignItems="center">
                  <Text.Body3 color="secondaryBlue">View order</Text.Body3>
                  <Icon icon="chevron-right" />
                </Box>
              </InternalLink>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default OrderList
