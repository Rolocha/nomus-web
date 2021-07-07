import * as React from 'react'
import UnifiedReviewStep from 'src/pages/CardBuilder/UnifiedReviewStep'
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

  return (
    <UnifiedReviewStep
      cardBuilderState={cardBuilderState}
      updateCardBuilderState={updateCardBuilderState}
      cardDetails={{
        images: {
          front: frontFileItem?.url,
          back: backFileItem?.url,
        },
        orientation,
        metadata: [
          {
            section: 'Associated information',
            data: [
              {
                label: 'Front design file',
                value: frontFileItem?.file.name ?? 'None',
              },
              {
                label: 'Back design file',
                value: backFileItem?.file.name ?? 'None',
              },
            ],
          },
        ],
      }}
    />
  )
}

export default CustomReviewStep
