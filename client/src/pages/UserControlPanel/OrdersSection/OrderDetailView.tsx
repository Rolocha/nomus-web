import { css } from '@emotion/core'
import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import CopyableText from 'src/components/CopyableText'
import * as Text from 'src/components/Text'
import { ExternalLink } from 'src/components/Link'
import { Order } from 'src/types/order'
import { getFormattedFullDate } from 'src/utils/date'
import { formatDollarAmount } from 'src/utils/money'

interface Props {
  order: Order
}

const bp = 'md'

export default ({ order }: Props) => {
  return (
    <Box>
      <Text.H4>
        Order <CopyableText copyText={order.id}>{order.id}</CopyableText>
      </Text.H4>
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
            <Text.Body2>{order.state}</Text.Body2>
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
              <Text.Body2>TODO</Text.Body2>
            </Box>
            <Box>
              <Text.Body2>Tax</Text.Body2>
              <Text.Body2>TODO</Text.Body2>
            </Box>
            <Box>
              <Text.Body2>Shipping</Text.Body2>
              <Text.Body2>{formatDollarAmount(500)}</Text.Body2>
            </Box>
            <Box>
              <Text.Body2 fontWeight="500">Total</Text.Body2>
              <Text.Body2 fontWeight="500">
                {formatDollarAmount(order.price)}
              </Text.Body2>
            </Box>
          </Box>
        </Box>
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
