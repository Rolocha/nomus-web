import * as React from 'react'
import { gql, useMutation } from 'src/apollo'
import { OrderState } from 'src/apollo/types/globalTypes'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import CopyableText from 'src/components/CopyableText'
import Image from 'src/components/Image'
import Link from 'src/components/Link'
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
    mutation CancelOrderMutation($orderId: String!) {
      transitionOrderState(orderId: $orderId, futureState: ${OrderState.Canceled}) {
        id
        state
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
      <Text.Body3 color={colors.africanElephant}>
        <CopyableText copyText={order.id}>{order.id}</CopyableText>
      </Text.Body3>
      <Box
        pt={2}
        display="grid"
        gridTemplateColumns={{ base: '1fr', [bp]: '1fr 1fr' }}
        gridGap="16px"
      >
        {order.cardVersion.frontImageUrl && (
          <Image
            src={order.cardVersion.frontImageUrl}
            alt={`front of business card from order ${order.id}`}
            boxShadow="businessCard"
          />
        )}
        {order.cardVersion.backImageUrl && (
          <Image
            src={order.cardVersion.backImageUrl}
            alt={`back of business card from order ${order.id}`}
            boxShadow="businessCard"
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
          base: `
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
            <Text.Body2>{getUserFacingOrderState(order.state)}</Text.Body2>
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
            borderRadius="lg"
            p={3}
            sx={{
              '&>*': {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            }}
          >
            <Box>
              <Text.Body2>Subtotal</Text.Body2>
              <Text.Body2>
                {order.price ? formatDollarAmount(order.price.subtotal) : '-'}
              </Text.Body2>
            </Box>
            <Box>
              <Text.Body2>Tax</Text.Body2>
              <Text.Body2>
                {order.price ? formatDollarAmount(order.price.tax) : '-'}
              </Text.Body2>
            </Box>
            <Box>
              <Text.Body2>Shipping</Text.Body2>
              <Text.Body2>
                {order.price ? formatDollarAmount(order.price.shipping) : '-'}
              </Text.Body2>
            </Box>
            {!!order.price?.discount && (
              <Box>
                <Text.Body2>Discount</Text.Body2>
                <Text.Body2>
                  {formatDollarAmount(order.price.discount)}
                </Text.Body2>
              </Box>
            )}
            <Box>
              <Text.Body2 fontWeight="500">Total</Text.Body2>
              <Text.Body2 fontWeight="500">
                {order.price ? formatDollarAmount(order.price.total) : '-'}
              </Text.Body2>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt={4} display="flex" mx={-3}>
        {[OrderState.Captured, OrderState.Actionable].includes(order.state) && (
          <Box px={3}>
            <Button
              variant="danger"
              isLoading={orderCancelLoading}
              loadingText="Canceling your order"
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
          <Link
            to={`mailto:hi@nomus.me?subject=Issue with Nomus order (${order.id})`}
          >
            hi@nomus.me
          </Link>
          .
        </Text.Body3>
      </Box>
    </Box>
  )
}
