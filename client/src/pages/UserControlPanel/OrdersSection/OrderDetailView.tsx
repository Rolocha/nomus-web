import * as Sentry from '@sentry/react'
import * as React from 'react'
import { gql, useMutation, useQuery } from 'src/apollo'
import { OrderState } from 'src/apollo/types/globalTypes'
import Box from 'src/components/Box'
import BusinessCardFan from 'src/components/BusinessCardFan'
import Button from 'src/components/Button'
import CopyableText from 'src/components/CopyableText'
import Link from 'src/components/Link'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { colors } from 'src/styles'
import { getFormattedFullDate } from 'src/utils/date'
import { formatDollarAmount } from 'src/utils/money'
import { getUserFacingOrderState } from 'src/utils/order'

interface Props {
  orderId: string
}

export default ({ orderId }: Props) => {
  const { data, loading, error } = useQuery(
    gql`
      query OrderDetailViewQuery($orderId: String!) {
        order(orderId: $orderId) {
          id
          shortId
          createdAt
          state
          shippingName
          shippingAddress {
            line1
            line2
            city
            state
            postalCode
          }
          cardVersion {
            frontImageUrl
            backImageUrl
          }
          quantity
          price {
            subtotal
            tax
            shipping
            total
          }
          user {
            email
            name {
              first
            }
          }
        }
      }
    `,
    {
      variables: { orderId },
    },
  )

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

  if (loading) {
    return <LoadingPage />
  }

  if (data == null || error) {
    Sentry.captureException(error)
    return <Box>Uh oh, something went wrong on our end!</Box>
  }

  const order = data.order

  return (
    <Box>
      <Text.H4>Your {getFormattedFullDate(order.createdAt)} order</Text.H4>
      <Text.Body3 color={colors.africanElephant}>
        <Box as="span" color={colors.midnightGray}>
          ID:
        </Box>{' '}
        <CopyableText copyText={order.shortId}>{order.shortId}</CopyableText>
      </Text.Body3>
      <Box
        display="grid"
        gridTemplateColumns="3fr 3fr"
        gridGap="16px"
        gridTemplateAreas={`
          "cards details"
          "pricing pricing" 
        `}
      >
        <Box
          gridArea="cards"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
        >
          <BusinessCardFan
            frontImageUrl={order.cardVersion.frontImageUrl}
            backImageUrl={order.cardVersion.backImageUrl}
          />
          <Link
            mt="16px"
            // TODO: Redesign /cards so that it's possible to link to a specific card version
            // This won't really be a problem until users have many (like 5+) card versions
            to="/dashboard/cards"
            buttonStyle="tertiary"
          >
            View in card library
          </Link>
        </Box>
        <Box
          gridArea="details"
          display="grid"
          gridTemplateColumns="1fr"
          gridRowGap={3}
          gridTemplateAreas={`
            "status" 
            "orderDate"
            "quantity"
            "shippingAddress"
          `}
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
          <Box gridArea="shippingAddress">
            <Text.Label>Shipping Address</Text.Label>
            <Text.Body2>{`${order.shippingName}`}</Text.Body2>
            {order.shippingAddress ? (
              <Box>
                <Text.Body2>{order.shippingAddress.line1}</Text.Body2>
                {order.shippingAddress.line2 && (
                  <Text.Body2>{order.shippingAddress.line1}</Text.Body2>
                )}
                <Text.Body2>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </Text.Body2>
              </Box>
            ) : (
              '—'
            )}
          </Box>
        </Box>
        <Box gridArea="pricing" placeSelf="end stretch">
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
