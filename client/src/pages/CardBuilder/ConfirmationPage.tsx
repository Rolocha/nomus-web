import * as React from 'react'
import { CardBuilderConfirmationScreenQuery } from 'src/apollo/types/CardBuilderConfirmationScreenQuery'
import Box from 'src/components/Box'
import BusinessCardFan from 'src/components/BusinessCardFan'
import Footer from 'src/components/Footer'
import Link from 'src/components/Link'
import Navbar from 'src/components/Navbar'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { breakpoints } from 'src/styles/breakpoints'
import shadows from 'src/styles/shadows'
import theme from 'src/styles/theme'
import { createMailtoURL } from 'src/utils/email'
import { formatDollarAmount } from 'src/utils/money'
import { DateTime } from 'luxon'

interface Props {
  order: CardBuilderConfirmationScreenQuery['order']
}

const bp = 'lg'

const ConfirmationPage = ({ order }: Props) => {
  return (
    <Box
      bg={theme.colors.white}
      minHeight="100vh"
      minWidth={{ base: '0', [bp]: `calc(1.1 * ${breakpoints.lg})` }}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      zIndex={0}
    >
      <Navbar />

      <Box
        container
        zIndex={0}
        pt={{ base: '40px', [bp]: '64px' }}
        pb={{ base: '40px', [bp]: '96px' }}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
      >
        <Box
          display="grid"
          gridColumnGap="16px"
          gridRowGap={{ base: '32px', [bp]: '48px' }}
          gridTemplateColumns={{
            base: '1fr',
            [bp]: '3fr 7fr',
          }}
          gridTemplateAreas={{
            base: `
            "header"
            "cardDetails"
            "orderDetails"
          `,
            [bp]: `
          "cardDetails header"
          "cardDetails orderDetails"
        `,
          }}
        >
          <Box gridArea="header">
            <Text.H2 mb="16px" color={colors.nomusBlue}>
              Thank you for your order,{' '}
              {order.user?.name?.first ?? order.shippingName}!
            </Text.H2>
            <Text.Body mb="8px">
              We're getting straight to work creating your cards. In the
              meantime, customize your Nomus profile so you're ready to hit the
              ground running when your cards arrive.
            </Text.Body>

            <Box
              display="flex"
              mt="24px"
              flexDirection={{ base: 'column', [bp]: 'row' }}
            >
              <Box mr={{ base: 0, [bp]: '16px' }} mb={{ base: '8px', [bp]: 0 }}>
                <Link to="/dashboard/profile" asButton buttonStyle="primary">
                  Customize profile
                </Link>
              </Box>
              <Link to="/dashboard/cards" asButton buttonStyle="secondary">
                Manage cards
              </Link>
            </Box>
          </Box>
          <Box gridArea="cardDetails">
            <Box mb="16px" p="32px">
              <BusinessCardFan
                frontImageUrl={order.cardVersion.frontImageUrl!}
                backImageUrl={order.cardVersion.backImageUrl!}
              />
            </Box>
            <Box
              borderRadius="16px"
              boxShadow={shadows.card}
              mb="16px"
              p="32px"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text.Body2>Card quantity</Text.Body2>
                <Text.Body2>{order.quantity} cards</Text.Body2>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text.Body2 fontWeight="bold">Total</Text.Body2>
                <Text.Body2 fontWeight="bold">
                  {order.price ? formatDollarAmount(order.price.total) : '—'}
                </Text.Body2>
              </Box>
            </Box>
            <Text.Body2>
              Need help?{' '}
              <Link
                to={createMailtoURL({
                  to: 'hi@nomus.me',
                  subject: `[Order #${order.shortId}] `,
                })}
              >
                Contact us.
              </Link>
            </Text.Body2>
          </Box>
          <Box gridArea="orderDetails">
            <Box
              mb="24px"
              display="grid"
              gridTemplateColumns={{ base: '2fr 2fr', [bp]: '2fr 5fr' }}
              gridColumnGap="16px"
              gridRowGap="24px"
            >
              <Text.Body2 fontWeight="bold">Order number</Text.Body2>
              <Text.Body2>{order.shortId}</Text.Body2>

              <Text.Body2 fontWeight="bold">
                Confirmation email sent to
              </Text.Body2>
              <Text.Body2>{order.user ? order.user.email : '—'}</Text.Body2>

              <Text.Body2 fontWeight="bold">Shipping address</Text.Body2>
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

              <Text.Body2 fontWeight="bold">Delivery ETA</Text.Body2>
              <Text.Body2>
                {DateTime.fromMillis(order.createdAt)
                  .plus({ days: 21 })
                  .toLocaleString(DateTime.DATE_HUGE)}
              </Text.Body2>
            </Box>

            <Text.Body2>
              You can view your order details at any time by visiting the{' '}
              <Link to={`/dashboard/orders/${order.id}`}>Orders tab</Link> in
              your dashboard.
            </Text.Body2>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default ConfirmationPage
