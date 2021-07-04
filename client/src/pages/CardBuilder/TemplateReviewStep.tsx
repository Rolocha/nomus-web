import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import UnifiedReviewStep, {
  CardMetadata,
} from 'src/pages/CardBuilder/UnifiedReviewStep'
import templateLibrary from 'src/templates'
import { getNameForColorKey } from 'src/templates/utils'
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

  const metadata: CardMetadata = React.useMemo(() => {
    if (
      !cardBuilderState.templateCustomization ||
      !cardBuilderState.templateId
    ) {
      return []
    }

    const template = templateLibrary[cardBuilderState.templateId]
    const options = template.createOptionsFromFormFields(
      cardBuilderState.templateCustomization!,
      cardBuilderState.omittedOptionalFields as Array<any>,
    )
    const associatedInformation: CardMetadata[0]['data'] = []
    template.contactInfoFieldNames.forEach((fieldName) => {
      const { label } = template.contactInfoSpec[fieldName]
      const value = options.contactInfo[fieldName]
      if (label && value) {
        associatedInformation.push({
          label,
          value,
        })
      }
    })

    const colors: CardMetadata[0]['data'] = []
    template.colorKeys.forEach((colorKey) => {
      const label = getNameForColorKey(colorKey)
      const value = options.colorScheme[colorKey]?.toUpperCase()
      if (label && value) {
        colors.push({
          label,
          value: (
            <Box display="flex" key={label + 'color'}>
              <Box
                width="24px"
                height="24px"
                borderRadius="2px"
                bgColor={value}
                boxShadow="card"
                mr="8px"
              />
              <Text.Body2>{value}</Text.Body2>
            </Box>
          ),
        })
      }
    }, [])

    return [
      { section: 'Associated information', data: associatedInformation },
      { section: 'Colors', data: colors },
    ]
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
    <UnifiedReviewStep
      cardBuilderState={cardBuilderState}
      updateCardBuilderState={updateCardBuilderState}
      cardDetails={{
        images: {
          front: cardImages?.front,
          back: cardImages?.back,
        },
        orientation,
        metadata,
      }}
    />
  )
}

export default TemplateReviewStep
