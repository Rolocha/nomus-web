import * as React from 'react'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import * as Text from 'src/components/Text'
import OrderSummary from 'src/pages/CardBuilder/OrderSummary'
import { CardBuilderState } from './card-builder-state'

interface Props {
  cardBuilderState: CardBuilderState
}

const CustomReviewStep = ({ cardBuilderState }: Props) => {
  const frontFileItem = cardBuilderState.frontDesignFile
  const backFileItem = cardBuilderState.backDesignFile

  return (
    <Box height="100%">
      <Text.SectionHeader mb="24px">Your card design</Text.SectionHeader>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 4fr)"
        gridColumnGap={3}
      >
        {frontFileItem && (
          <BusinessCardImage width="100%" frontImageUrl={frontFileItem.url} />
        )}
        {backFileItem && (
          <BusinessCardImage width="100%" backImageUrl={backFileItem.url} />
        )}
        <Box>
          <Text.SectionSubheader>Associated information</Text.SectionSubheader>
          <Box display="grid" gridTemplateColumns="2fr 2fr" gridRowGap={2}>
            <Text.Body2>Front design file</Text.Body2>
            <Text.Body2>{frontFileItem?.file.name ?? 'None'}</Text.Body2>
            <Text.Body2>Back design file</Text.Body2>
            <Text.Body2>{backFileItem?.file.name ?? 'None'}</Text.Body2>
          </Box>
        </Box>
      </Box>

      <OrderSummary
        cardBuilderState={cardBuilderState}
        cardDescription="Nomus card - custom design"
      />
    </Box>
  )
}

export default CustomReviewStep
