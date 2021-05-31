import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import CardDesignReview from 'src/pages/CardBuilder/CardDesignReview'
import OrderSummary from 'src/pages/CardBuilder/OrderSummary'
import { colors } from 'src/styles'
import templateLibrary from 'src/templates'
import { CardBuilderAction, CardBuilderState } from './card-builder-state'

interface Props {
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
}

const TemplateReviewStep = ({
  cardBuilderState,
  updateCardBuilderState,
}: Props) => {
  // The template card image needs to be asynchronously generated
  // so we start by setting it to null then firing off a one-time
  // effect that generates it and updates the cardImages state once
  // it completes
  const [cardImages, setCardImages] = React.useState<{
    front: string
    back: string
  } | null>(null)
  React.useEffect(() => {
    if (cardImages == null) {
      const template = templateLibrary[cardBuilderState.templateId!]
      template
        .renderBothSidesToDataUrls(
          template.createOptionsFromFormFields(
            cardBuilderState.templateCustomization!,
            cardBuilderState.omittedOptionalFields as Array<any>,
          ),
        )
        .then((response) => {
          setCardImages(response)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [cardBuilderState, cardImages, setCardImages])

  const associatedInfo = React.useMemo(() => {
    if (
      !cardBuilderState.templateCustomization ||
      !cardBuilderState.templateId
    ) {
      return [{ label: 'Unknown', value: 'Unknown' }]
    }

    const template = templateLibrary[cardBuilderState.templateId]
    const options = template.createOptionsFromFormFields(
      cardBuilderState.templateCustomization!,
      cardBuilderState.omittedOptionalFields as Array<any>,
    )
    const info: Array<{ label: string; value: string }> = []
    template.contactInfoFieldNames.forEach((fieldName) => {
      const { label } = template.contactInfoSpec[fieldName]
      const value = options.contactInfo[fieldName]
      if (label && value) {
        info.push({
          label,
          value,
        })
      }
    })
    return info
  }, [
    cardBuilderState.templateId,
    cardBuilderState.templateCustomization,
    cardBuilderState.omittedOptionalFields,
  ])

  const orientation = React.useMemo(() => {
    const template = templateLibrary[cardBuilderState.templateId!]
    if (template.width > template.height) return 'horizontal'
    return 'vertical'
  }, [cardBuilderState.templateId])

  return (
    <Box height="100%">
      {cardImages && (
        <CardDesignReview
          cardBuilderState={cardBuilderState}
          orientation={orientation}
          associatedInfo={associatedInfo}
          cardImages={{
            front: cardImages.front,
            back: cardImages.back,
          }}
        />
      )}

      <Box mt={4}>
        <OrderSummary
          cardBuilderState={cardBuilderState}
          cardDescription={
            'Nomus card - ' +
            (cardBuilderState.templateId
              ? templateLibrary[cardBuilderState.templateId].name
              : 'Unknown') +
            ' template'
          }
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

export default TemplateReviewStep
