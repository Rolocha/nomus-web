import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import { CardBuilderState } from 'src/pages/CardBuilder/card-builder-state'
import CostSummary from 'src/pages/CardBuilder/CostSummary'
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
    cardBuilderState.checkoutFormData?.state,
  )
  return (
    <Box>
      <Text.SectionHeader mb="24px">Order summary</Text.SectionHeader>

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
              cardBuilderState.checkoutFormData.name,
              cardBuilderState.checkoutFormData?.line1,
              cardBuilderState.checkoutFormData?.line2,
              `${
                cardBuilderState.checkoutFormData?.city
              }, ${cardBuilderState.checkoutFormData?.state.toUpperCase()} ${
                cardBuilderState.checkoutFormData?.postalCode
              }`,
            ]
              .filter(Boolean)
              .map((line, index) => (
                <Text.Body2 key={index}>{line}</Text.Body2>
              ))}
          </Box>
        </Box>

        <Box gridArea="costSummary" placeSelf="end end" width="100%">
          <CostSummary
            quantity={cardBuilderState.quantity}
            state={cardBuilderState.checkoutFormData?.state}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default OrderSummary
