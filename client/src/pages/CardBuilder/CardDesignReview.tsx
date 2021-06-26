import * as React from 'react'
import { CardSpecBaseType } from 'src/apollo/types/globalTypes'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import * as Text from 'src/components/Text'
import templateLibrary from 'src/templates'
import { getNameForColorKey } from 'src/templates/utils'
import { CardBuilderState } from './card-builder-state'

interface Props {
  cardBuilderState: CardBuilderState
  orientation: 'horizontal' | 'vertical'
  associatedInfo: Array<{ label: string; value: string }>
  cardImages: {
    front?: string
    back?: string
  }
}

const CardDesignReview = ({
  cardBuilderState,
  orientation,
  cardImages,
  associatedInfo,
}: Props) => {
  const colorInfo = React.useMemo(() => {
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
    template.colorKeys.forEach((colorKey) => {
      const label = getNameForColorKey(colorKey)
      const value = options.colorScheme[colorKey]?.toUpperCase()
      if (label && value) {
        info.push({ label, value })
      }
    }, [])

    return info
  }, [
    cardBuilderState.templateId,
    cardBuilderState.templateCustomization,
    cardBuilderState.omittedOptionalFields,
  ])
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
          "associatedInfo"
          "colorInfo"
          `,
          vertical: `
          "frontCard backCard"
          "associatedInfo associatedInfo"
          "colorInfo colorInfo"
          
        `,
        }[orientation],
        lg: {
          horizontal: `
          "frontCard backCard ."
          "associatedInfo associatedInfo colorInfo"
        `,
          vertical: `
        "frontCard backCard associatedInfo"
        "frontCard backCard colorInfo"
        `,
        }[orientation],
      }}
      gridColumnGap="16px"
      gridRowGap="24px"
    >
      {cardImages?.front && (
        <Box gridArea="frontCard">
          <BusinessCardImage width="100%" frontImageUrl={cardImages.front} />
        </Box>
      )}
      {cardImages?.back && (
        <Box gridArea="backCard">
          <BusinessCardImage width="100%" backImageUrl={cardImages.back} />
        </Box>
      )}
      <Box gridArea="associatedInfo">
        <Text.SectionSubheader mb={{ base: '8px', lg: '16px' }}>
          Associated information
        </Text.SectionSubheader>
        <Box display="grid" gridTemplateColumns="2fr 2fr" gridRowGap={2}>
          {associatedInfo.map((item, index) => [
            <Text.Body2 key={index + '0'}>{item.label}</Text.Body2>,
            <Text.Body2 key={index + '1'}>{item.value}</Text.Body2>,
          ])}
        </Box>
      </Box>
      {cardBuilderState.baseType === CardSpecBaseType.Template && (
        <Box gridArea="colorInfo">
          <Text.SectionSubheader mb={{ base: '8px', lg: '16px' }}>
            Colors
          </Text.SectionSubheader>
          <Box display="grid" gridTemplateColumns="2fr 2fr" gridRowGap={2}>
            {colorInfo.map((item, index) => [
              <Text.Body2 key={item.label + 'label'}>{item.label}</Text.Body2>,
              <Box display="flex" key={item.label + 'color'}>
                <Box
                  width="24px"
                  height="24px"
                  borderRadius="2px"
                  bgColor={item.value}
                  boxShadow="card"
                  mr="8px"
                />
                <Text.Body2>{item.value}</Text.Body2>
              </Box>,
            ])}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CardDesignReview
