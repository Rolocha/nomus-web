import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import CardDesignReview from 'src/pages/CardBuilder/CardDesignReview'
import OrderSummary from 'src/pages/CardBuilder/OrderSummary'
import { getImageDimensions } from 'src/utils/image'
import { CardBuilderState } from './card-builder-state'

interface Props {
  cardBuilderState: CardBuilderState
}

const CustomReviewStep = ({ cardBuilderState }: Props) => {
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

      <OrderSummary
        cardBuilderState={cardBuilderState}
        cardDescription="Nomus card - custom design"
      />
    </Box>
  )
}

export default CustomReviewStep
