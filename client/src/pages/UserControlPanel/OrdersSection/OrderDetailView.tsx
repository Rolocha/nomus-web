import { css } from '@emotion/core'
import * as React from 'react'
import { gql, useMutation } from 'src/apollo'
import { OrderCancelationState } from 'src/apollo/types/globalTypes'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import CopyableText from 'src/components/CopyableText'
import Image from 'src/components/Image'
import { ExternalLink } from 'src/components/Link'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { Order } from 'src/types/order'
import { getFormattedFullDate } from 'src/utils/date'
import { formatDollarAmount } from 'src/utils/money'
import { getUserFacingOrderState } from 'src/utils/order'

interface Props {
  order: Order
}

const bp = 'md'

export default ({ order }: Props) => {
  const [cancelOrder, { loading: orderCancelLoading }] = useMutation(gql`
    mutation CancelOrderMutation($orderId: String) {
      cancelOrder(orderId: $orderId) {
        id
        cancelationState
      }
    }
  `)

  const handleClickOrderCancel = async () => {
    if (
      window.confirm(
        'Are you sure you want to cancel this order? If you change your mind, you can click the link below to e-mail us.',
      )
    ) {
      await cancelOrder({
        variables: {
          orderId: order.id,
        },
      })
    }
  }

  return (
    <Box>
      <Text.H4>Your {getFormattedFullDate(order.createdAt)} order</Text.H4>
      <Text.Body3 color={colors.lightGray}>
        <CopyableText copyText={order.id}>{order.id}</CopyableText>
      </Text.Body3>
      <Box
        pt={2}
        display="flex"
        flexDirection={{ _: 'column', [bp]: 'row' }}
        mx={{ _: -2, [bp]: -2 }}
        my={{ _: -2, [bp]: -2 }}
      >
        {order.cardVersion.frontImageUrl && (
          <Image
            p={2}
            w={{ _: '100%', [bp]: '50%' }}
            src={order.cardVersion.frontImageUrl}
            alt={`front of business card from order ${order.id}`}
          />
        )}
        {order.cardVersion.backImageUrl && (
          <Image
            p={2}
            w={{ _: '100%', [bp]: '50%' }}
            src={order.cardVersion.backImageUrl}
            alt={`back of business card from order ${order.id}`}
          />
        )}
      </Box>
      <Text.H5 mt={4} mb={3}>
        Order summary
      </Text.H5>
      <Box
        display="grid"
        gridTemplateColumns="3fr 3fr"
        gridRowGap={3}
        gridTemplateAreas={{
          _: `
        "details details" 
        "pricing pricing"`,
          [bp]: `
        "details pricing"
        `,
        }}
      >
        <Box
          gridArea="details"
          display="grid"
          gridTemplateColumns="3fr 3fr"
          gridRowGap={3}
          gridTemplateAreas={`"status status" "orderDate quantity"`}
        >
          <Box gridArea="status">
            <Text.Label>Status</Text.Label>
            <Text.Body2>{getUserFacingOrderState(order)}</Text.Body2>
          </Box>
          <Box gridArea="orderDate">
            <Text.Label>Date Ordered</Text.Label>
            <Text.Body2>{getFormattedFullDate(order.createdAt)}</Text.Body2>
          </Box>
          <Box gridArea="quantity">
            <Text.Label>Quantity</Text.Label>
            <Text.Body2>{`${order.quantity} cards`}</Text.Body2>
          </Box>
        </Box>
        <Box gridArea="pricing">
          <Box
            boxShadow="workingWindow"
            borderRadius={2}
            p={3}
            css={css({
              '&>*': {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            })}
          >
            <Box>
              <Text.Body2>Subtotal</Text.Body2>
              <Text.Body2>
                {formatDollarAmount(order.price.subtotal)}
              </Text.Body2>
            </Box>
            <Box>
              <Text.Body2>Tax</Text.Body2>
              <Text.Body2>{formatDollarAmount(order.price.tax)}</Text.Body2>
            </Box>
            <Box>
              <Text.Body2>Shipping</Text.Body2>
              <Text.Body2>
                {formatDollarAmount(order.price.shipping)}
              </Text.Body2>
            </Box>
            <Box>
              <Text.Body2 fontWeight="500">Total</Text.Body2>
              <Text.Body2 fontWeight="500">
                {formatDollarAmount(order.price.total)}
              </Text.Body2>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt={4} display="flex" mx={-3}>
        {order.cancelationState === OrderCancelationState.NotCanceled && (
          <Box px={3}>
            <Button
              variant="danger"
              inProgress={orderCancelLoading}
              inProgressText="Canceling your order"
              onClick={handleClickOrderCancel}
            >
              Cancel order
            </Button>
          </Box>
        )}
      </Box>
      <Box mt={4}>
        <Text.Body3 textAlign="center">
          Need help with your order? Shoot us an email at{' '}
          <ExternalLink
            href={`mailto:hi@nomus.me?subject=Issue with Nomus order (${order.id})`}
          >
            hi@nomus.me
          </ExternalLink>
          .
        </Text.Body3>
      </Box>
    </Box>
  )
}
