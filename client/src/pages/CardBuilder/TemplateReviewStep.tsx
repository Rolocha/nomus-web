import * as React from 'react'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import * as Text from 'src/components/Text'
import OrderSummary from 'src/pages/CardBuilder/OrderSummary'
import templateLibrary from 'src/templates'
import { CardBuilderState } from './card-builder-state'

interface Props {
  cardBuilderState: CardBuilderState
}

const TemplateReviewStep = ({ cardBuilderState }: Props) => {
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
      templateLibrary[cardBuilderState.templateId!]
        .renderBothSidesToDataUrls(
          cardBuilderState.templateCustomization! as any,
        )
        .then((response) => {
          setCardImages(response)
        })
    }
  }, [cardBuilderState, cardImages, setCardImages])

  const associatedInfo = React.useMemo(() => {
    if (
      !cardBuilderState.templateCustomization ||
      !cardBuilderState.templateId
    ) {
      return [{ field: 'Unknown', value: 'Unknown' }]
    }

    const template = templateLibrary[cardBuilderState.templateId]
    const options = template.createOptionsFromFormFields(
      cardBuilderState.templateCustomization!,
    )
    return template.customizableOptionNames.reduce<
      { field: string; value: React.ReactNode }[]
    >((acc, field) => {
      const { label, type } = template.customizableOptions[field]
      if (label != null) {
        switch (type) {
          case 'text':
            if (options[field]) {
              acc.push({
                field: label,
                value: String(options[field]),
              })
            }
            break
          default:
            break
        }
      }
      return acc
    }, [])
  }, [cardBuilderState.templateId, cardBuilderState.templateCustomization])

  return (
    <Box height="100%">
      <Text.SectionHeader mb="24px">Your card design</Text.SectionHeader>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 4fr)"
        gridColumnGap={3}
      >
        {cardImages?.front && (
          <BusinessCardImage width="100%" frontImageUrl={cardImages.front} />
        )}
        {cardImages?.back && (
          <BusinessCardImage width="100%" backImageUrl={cardImages.back} />
        )}
        <Box>
          <Text.SectionSubheader>Associated information</Text.SectionSubheader>
          <Box display="grid" gridTemplateColumns="2fr 2fr" gridRowGap={2}>
            {associatedInfo.map((item, index) => [
              <Text.Body2 key={index + '0'}>{item.field}</Text.Body2>,
              <Text.Body2 key={index + '1'}>{item.value}</Text.Body2>,
            ])}
          </Box>
        </Box>
      </Box>

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
  )
}

export default TemplateReviewStep
