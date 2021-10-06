import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import CardDesignReview from 'src/pages/CardBuilder/CardDesignReview'
import OrderQuantitySelector from 'src/pages/CardBuilder/OrderQuantitySelector'
import SubmissionError from 'src/pages/CardBuilder/SubmissionError'
import { CardBuilderAction, CardBuilderState } from './card-builder-state'

export type CardMetadata = Array<{
  section: string
  data: Array<{ label: string; value: React.ReactNode }>
}>

interface CardDetails {
  images: {
    front?: string
    back?: string
  }
  orientation?: 'vertical' | 'horizontal' | null
  metadata: CardMetadata
}

interface Props {
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
  cardDetails: CardDetails
}

// A base-type-agnostic review step component that accepts a set of props that's abstract
// enough to not have to think about base-type specifics within this rendering logic
const UnifiedReviewStep = ({
  cardBuilderState,
  updateCardBuilderState,
  cardDetails,
}: Props) => {
  return (
    <Box height="100%">
      <Text.SectionHeader mb="20px">Review your order</Text.SectionHeader>

      <Text.SectionSubheader mb={2}>
        How many cards do you want?
      </Text.SectionSubheader>
      <OrderQuantitySelector
        quantity={cardBuilderState.quantity}
        onChange={(quantity) => {
          updateCardBuilderState({
            quantity,
          })
        }}
      />

      <Text.SectionSubheader mb={2}>
        Everything look okay?
      </Text.SectionSubheader>
      {cardDetails.orientation && (
        <Box>
          <CardDesignReview
            cardBuilderState={cardBuilderState}
            orientation={cardDetails.orientation}
            metadata={cardDetails.metadata}
            cardImages={cardDetails.images}
          />
          <Text.Body3>* Discount code available at checkout</Text.Body3>
        </Box>
      )}

      {cardBuilderState.submissionError && (
        <SubmissionError
          submissionError={cardBuilderState.submissionError}
          goToStep={(step) => {
            updateCardBuilderState({
              currentStep: step,
            })
          }}
        />
      )}
    </Box>
  )
}

export default UnifiedReviewStep
