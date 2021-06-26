import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import { OrderQuantityOption } from 'src/pages/CardBuilder/types'
import { formatDollarAmount } from 'src/utils/money'
import { getCostSummary } from 'src/utils/pricing'

interface Props {
  quantity: OrderQuantityOption | null
  state?: string
}

const CostSummary = ({ quantity, state }: Props) => {
  const costSummary = getCostSummary(quantity, state?.toUpperCase())
  return (
    <Box
      boxShadow="workingWindow"
      borderRadius="lg"
      p={4}
      display="grid"
      gridTemplateColumns="2fr 1fr 1fr"
      sx={{
        '& > *:nth-of-type(3n)': {
          placeSelf: 'center end',
        },
      }}
      gridRowGap={3}
    >
      <Text.Body2>Subtotal</Text.Body2>
      <Box></Box>
      <Text.Body2>
        {costSummary?.subtotal
          ? formatDollarAmount(costSummary.subtotal)
          : '...'}
      </Text.Body2>

      <Text.Body2>Estimated taxes</Text.Body2>
      <Box></Box>
      <Text.Body2>
        {costSummary?.estimatedTaxes != null
          ? formatDollarAmount(costSummary.estimatedTaxes)
          : '...'}
      </Text.Body2>

      <Text.Body2>Shipping</Text.Body2>
      <Box></Box>
      <Text.Body2>
        {costSummary
          ? formatDollarAmount(costSummary?.shipping)
          : formatDollarAmount(0)}
      </Text.Body2>

      <Text.Body2 fontWeight={500}>Estimated total</Text.Body2>
      <Box></Box>
      <Text.Body2 fontWeight={500}>
        {costSummary?.total ? formatDollarAmount(costSummary.total) : '...'}
      </Text.Body2>
    </Box>
  )
}

export default CostSummary
