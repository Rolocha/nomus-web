import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import CardDesignReview from 'src/pages/CardBuilder/CardDesignReview'
import OrderSummary from 'src/pages/CardBuilder/OrderSummary'
import { colors } from 'src/styles'
import { getImageDimensions } from 'src/utils/image'
import { CardBuilderAction, CardBuilderState } from './card-builder-state'

interface Props {
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
}

const CustomReviewStep = ({
  cardBuilderState,
  updateCardBuilderState,
}: Props) => {
  const frontFileItem = cardBuilderState.frontDesignFile
  const backFileItem = cardBuilderState.backDesignFile

  const [orientation, setOrientation] = React.useState<
    'horizontal' | 'vertical' | null
  >(null)

  React.useEffect(() => {
    const determineOrientation = async () => {
      if (frontFileItem?.url || backFileItem?.url) {
        const frontDims = frontFileItem?.url
          ? await getImageDimensions(frontFileItem.url)
          : null
        const backDims = backFileItem?.url
          ? await getImageDimensions(backFileItem.url)
          : null
        setOrientation(
          (frontDims && frontDims.width > frontDims.height) ||
            (backDims && backDims.width > backDims.height)
            ? 'horizontal'
            : 'vertical',
        )
      }
    }

    determineOrientation()
  }, [frontFileItem, backFileItem])

  const associatedInfo = React.useMemo(() => {
    return [
      {
        label: 'Front design file',
        value: frontFileItem?.file.name ?? 'None',
      },
      {
        label: 'Back design file',
        value: backFileItem?.file.name ?? 'None',
      },
    ]
  }, [frontFileItem, backFileItem])

  return (
    <Box height="100%">
      <Text.SectionHeader mb="24px">Your card design</Text.SectionHeader>

      {orientation && (frontFileItem?.url || backFileItem?.url) && (
        <CardDesignReview
          cardBuilderState={cardBuilderState}
          orientation={orientation}
          associatedInfo={associatedInfo}
          cardImages={{
            front: frontFileItem?.url,
            back: backFileItem?.url,
          }}
        />
      )}

      <Box mt={4}>
        <OrderSummary
          cardBuilderState={cardBuilderState}
          cardDescription="Nomus card - custom design"
        />
      </Box>

      {cardBuilderState.submissionError && (
        <Text.Body2 mt="24px" color={colors.invalidRed}>
          {cardBuilderState.submissionError.message}
          {cardBuilderState.submissionError.backlinkToStep && (
            <Text.Body2
              as="span"
              role="button"
              cursor="pointer"
              color={colors.linkBlue}
              onClick={() => {
                updateCardBuilderState({
                  currentStep: cardBuilderState.submissionError?.backlinkToStep,
                })
              }}
            >
              {` Return to the ${cardBuilderState.submissionError.backlinkToStep} step.`}
            </Text.Body2>
          )}
        </Text.Body2>
      )}
    </Box>
  )
}

export default CustomReviewStep
