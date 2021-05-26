import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import { CardBuilderState } from 'src/pages/CardBuilder/card-builder-state'
import { colors } from 'src/styles'
import { formatDollarAmount } from 'src/utils/money'
import { getCostSummary } from 'src/utils/pricing'

interface Props {
  cardBuilderState: CardBuilderState
  cardDescription: string
}

const OrderSummary = ({ cardBuilderState, cardDescription }: Props) => {
  const costSummary = getCostSummary(
    cardBuilderState.quantity,
    cardBuilderState.formData?.state,
  )
  return (
    <Box>
      <Text.SectionHeader mt={4} mb="24px">
        Order summary
      </Text.SectionHeader>

      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', md: '7fr 1fr 4fr' }}
        gridTemplateAreas={{
          base: `
            "detailSummary1"
            "detailSummary2"
            "costSummary"
          `,
          md: `
            "detailSummary1 . costSummary"
            "detailSummary2 . costSummary"
          `,
        }}
        gridRowGap="16px"
      >
        <Box
          gridArea="detailSummary1"
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gridRowGap="8px"
          placeSelf="start stretch"
          pb={4}
          borderBottom={`1px solid ${colors.africanElephant}`}
        >
          {/* <Box> */}
          <Text.Body2 fontWeight="500">Item</Text.Body2>
          <Text.Body2>{cardDescription}</Text.Body2>
          {/* </Box> */}

          {/* <Box> */}
          <Text.Body2 fontWeight="500">Quantity</Text.Body2>
          <Text.Body2>{cardBuilderState.quantity} cards</Text.Body2>
          {/* </Box> */}

          {/* <Box> */}
          <Text.Body2 fontWeight="500">Price</Text.Body2>
          <Text.Body2>
            {costSummary?.subtotal
              ? formatDollarAmount(costSummary?.subtotal)
              : '...'}
          </Text.Body2>
          {/* </Box> */}

          <Box>{/* <EditButton /> */}</Box>
        </Box>

        <Box
          pt={4}
          gridArea="detailSummary2"
          display="grid"
          gridTemplateColumns="3fr 3fr"
          placeSelf="start stretch"
          justifyItems="start"
          gridRowGap={3}
        >
          {/* next row */}
          <Text.Body2>Shipping info</Text.Body2>
          <Box>
            {[
              cardBuilderState.formData?.addressLine1,
              cardBuilderState.formData?.addressLine2,
              `${cardBuilderState.formData?.city}, ${cardBuilderState.formData?.state} ${cardBuilderState.formData?.postalCode}`,
            ]
              .filter(Boolean)
              .map((line, index) => (
                <Text.Body2 key={index}>{line}</Text.Body2>
              ))}
          </Box>

          {/* next row */}
          <Text.Body2>Payment</Text.Body2>
          <Box>
            {[
              `${cardBuilderState?.stripeToken?.card?.brand} ${cardBuilderState?.stripeToken?.card?.funding} card`,
              `**** **** **** ${cardBuilderState?.stripeToken?.card?.last4}`,
              `${cardBuilderState?.stripeToken?.card?.address_zip}`,
            ].map((line, index) => (
              <Text.Body2 key={index}>{line}</Text.Body2>
            ))}
          </Box>
        </Box>

        <Box
          gridArea="costSummary"
          width="100%"
          boxShadow="workingWindow"
          borderRadius="lg"
          placeSelf="end end"
          p={4}
          display="grid"
          gridTemplateColumns="2fr 1fr 1fr"
          sx={{
            '& > *:nth-child(3n)': {
              placeSelf: 'center end',
            },
          }}
          gridRowGap={3}
        >
          <Text.Body2>Subtotal</Text.Body2>
          <Box />
          <Text.Body2>
            {costSummary?.subtotal
              ? formatDollarAmount(costSummary.subtotal)
              : '...'}
          </Text.Body2>

          <Text.Body2>Estimated Taxes</Text.Body2>
          <Box />
          <Text.Body2>
            {costSummary?.estimatedTaxes != null
              ? formatDollarAmount(costSummary.estimatedTaxes)
              : '...'}
          </Text.Body2>

          <Text.Body2>Shipping</Text.Body2>
          <Box />
          <Text.Body2>{formatDollarAmount(500)}</Text.Body2>

          <Text.Body2 fontWeight={500}>Estimated Total</Text.Body2>
          <Box />
          <Text.Body2 fontWeight={500}>
            {costSummary?.total ? formatDollarAmount(costSummary.total) : '...'}
          </Text.Body2>
        </Box>
      </Box>
    </Box>
  )
}

export default OrderSummary
