import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import { CardMetadata } from 'src/pages/CardBuilder/UnifiedReviewStep'
import { CardBuilderState } from './card-builder-state'

interface Props {
  cardBuilderState: CardBuilderState
  orientation: 'horizontal' | 'vertical'
  metadata: CardMetadata
  cardImages: {
    front?: string
    back?: string
  }
}

const CardDesignReview = ({
  cardBuilderState,
  orientation,
  cardImages,
  metadata,
}: Props) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: { horizontal: '1fr', vertical: '1fr 1fr' }[orientation],
        lg: { horizontal: 'repeat(3, 4fr)', vertical: '3fr 3fr 6fr' }[
          orientation
        ],
      }}
      gridTemplateRows={{
        base: undefined,
        lg: { horizontal: 'auto 1fr', vertical: 'auto 1fr' }[orientation],
      }}
      gridTemplateAreas={{
        base: {
          horizontal: `
          "frontCard"
          "backCard"
          "metadata"
          `,
          vertical: `
          "frontCard backCard"
          "metadata metadata"
        `,
        }[orientation],
        lg: {
          horizontal: `
          "frontCard backCard ."
          "metadata metadata metadata"
        `,
          vertical: `
        "frontCard backCard metadata"
        "frontCard backCard metadata"
        `,
        }[orientation],
      }}
      gridColumnGap="16px"
      gridRowGap="24px"
    >
      {cardImages?.front && (
        <Box gridArea="frontCard">
          <Image width="100%" src={cardImages.front} boxShadow="businessCard" />
        </Box>
      )}
      {cardImages?.back && (
        <Box gridArea="backCard">
          <Image width="100%" src={cardImages.back} boxShadow="businessCard" />
        </Box>
      )}

      {/* Metadata, e.g. associated info, colors, etc. */}
      <Box
        gridArea="metadata"
        display="grid"
        gridGap="16px"
        gridTemplateColumns={{
          base: '1fr',
          lg: { horizontal: 'repeat(3, 4fr)', vertical: '1fr' }[orientation],
        }}
        gridTemplateRows={{
          base: undefined,
          lg: { horizontal: 'auto 1fr', vertical: 'auto 1fr' }[orientation],
        }}
      >
        {metadata.map(({ section, data }) => (
          <Box key={section}>
            <Text.SectionSubheader mb={{ base: '8px', lg: '16px' }}>
              {section}
            </Text.SectionSubheader>

            <Box display="grid" gridTemplateColumns="2fr 2fr" gridRowGap={2}>
              {data.map((item, index) => [
                <Text.Body2 key={index + '0'}>{item.label}</Text.Body2>,
                <Text.Body2 key={index + '1'}>{item.value}</Text.Body2>,
              ])}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CardDesignReview
