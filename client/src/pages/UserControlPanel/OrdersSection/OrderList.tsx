import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import { Order } from 'src/types/order'
import { getFormattedFullDate } from 'src/utils/date'
import { formatDollarAmount } from 'src/utils/money'

interface Props {
  orders: Array<Order>
}

const bp = 'lg'

const OrderList = ({ orders }: Props) => {
  const rowStyles = {
    display: 'grid',
    gridTemplateColumns: {
      _: '4fr 6fr 2fr',
      [bp]: '2fr 2fr 2fr 3fr 1fr 2fr',
    },
    gridTemplateRows: {
      _: '',
      [bp]: 'unset',
    },
    gridTemplateAreas: {
      _: `""`,
      [bp]: `"orderDate status orderNumber trackingNumber price viewOrder"`,
    },
    px: 3,
  }

  return (
    <Box>
      <Box {...rowStyles} mb={2}>
        {/* Sorta hacky, but this column is the only one where the label doesn't abide by the same grid spacing as the rows so the -3 margin-left helps push it back to the front */}
        <Box gridArea="orderDate" ml={-3}>
          <Text.Label>Date Ordered</Text.Label>
        </Box>
        <Box gridArea="status">
          <Text.Label>Status</Text.Label>
        </Box>
        <Box gridArea="orderNumber">
          <Text.Label>Order Number</Text.Label>
        </Box>
        <Box gridArea="trackingNumber">
          <Text.Label>Tracking Number</Text.Label>
        </Box>
        <Box gridArea="price">
          <Text.Label>Price</Text.Label>
        </Box>
        <Box gridArea="viewOrder"></Box>
      </Box>
      {orders.map((order) => {
        return (
          <Box
            key={order.id}
            borderRadius={3}
            borderWidth={1}
            borderStyle="solid"
            borderColor="africanElephant"
            py={1}
            mb={3}
            {...rowStyles}
            alignItems="center"
          >
            <Box gridArea="orderDate">
              <Text.Body2>{getFormattedFullDate(order.createdAt)}</Text.Body2>
            </Box>
            <Box gridArea="status">
              <Text.Body2>{order.state}</Text.Body2>
            </Box>
            <Box gridArea="orderNumber">
              <Text.Body2>{order.id}</Text.Body2>
            </Box>
            <Box gridArea="trackingNumber">
              <Text.Body2>{order.trackingNumber}</Text.Body2>
            </Box>
            <Box gridArea="price">
              {/* TODO: Will need to format this */}
              <Text.Body2>{formatDollarAmount(order.price)}</Text.Body2>
            </Box>
            <Box gridArea="viewOrder">
              <Button variant="tertiary">
                <Text.Body3 color="secondaryBlue">View order ></Text.Body3>
              </Button>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default OrderList
