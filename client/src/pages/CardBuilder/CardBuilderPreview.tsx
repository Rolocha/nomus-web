import { css } from '@emotion/react'
import { rgba } from 'polished'
import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as SVG from 'src/components/SVG'
import { colors } from 'src/styles'
import CardBuilderPreviewLegend from './CardBuilderPreviewLegend'

interface Props {
  frontFallback: React.ReactNode | null
  backFallback: React.ReactNode | null
  frontImage: React.ReactNode | null
  backImage: React.ReactNode | null
}

interface CardWithGuidesProps {
  showGuides: boolean
  innerContent?: React.ReactNode | null
}

// https://www.notion.so/GetSmart-NFC-Card-Specifications-2935b1ea8ac145a5bbdb62dea4c54df5
const specMeasurements = {
  width: 88.9,
  height: 50.8,
  xBleed: 2.05,
  yBleed: 1.6,
} as const

const CardWithGuides = ({ showGuides, innerContent }: CardWithGuidesProps) => {
  const { width, height, xBleed, yBleed } = specMeasurements
  const outerBleedPadding = {
    x: `calc(100% * ${xBleed / (width + xBleed * 2)})`,
    y: `calc(100% * ${yBleed / (height + yBleed * 2)})`,
  }
  const innerBleedDimensions = {
    x: `calc(100% * ${(width - xBleed * 2) / width})`,
    y: `calc(100% * ${(height - yBleed * 2) / height})`,
  }

  return (
    <Box
      width="100%"
      px={showGuides ? outerBleedPadding.x : 0}
      py={showGuides ? outerBleedPadding.y : 0}
      bg={rgba(colors.gold, 0.5)}
      overflow="visible"
    >
      <Box width="100%">
        <Box
          position="relative"
          border={showGuides ? '2px solid #444' : undefined}
          boxShadow={!showGuides ? 'businessCard' : undefined}
          overflow="visible"
        >
          <Box width="100%" pb="calc(100% * (4/7))" position="relative">
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              bg="white"
            >
              {innerContent}
            </Box>

            {showGuides && (
              // Content-safe area guide
              <Box
                position="absolute"
                css={css({ pointerEvents: 'none' })}
                top="0"
                left="0"
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  height={innerBleedDimensions.y}
                  width={innerBleedDimensions.x}
                  border={`2px dashed ${colors.brightCoral}`}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const CardBuilderPreview = ({
  frontImage,
  backImage,
  frontFallback,
  backFallback,
}: Props) => {
  const [showGuides, setShowGuides] = React.useState(false)
  const [showBack, setShowBack] = React.useState(false)
  const [showBothSides, setShowBothSides] = React.useState(false)

  // Since by default we show only the front card in the preview, if the user uploads the back image
  // we should (the first time) change the preview mode to show the image they just uploaded
  const [hasAutoShownBack, setHasAutoShownBack] = React.useState(false)
  React.useEffect(() => {
    if (backImage != null && !hasAutoShownBack) {
      setShowBothSides(true)
      setHasAutoShownBack(true)
    }
  }, [hasAutoShownBack, frontImage, backImage, setShowBack, setShowBothSides])

  const frontContent = frontImage ?? frontFallback
  const backContent = backImage ?? backFallback

  return (
    <Box display="grid" gridTemplateRows="auto 1fr auto">
      <Box
        display="grid"
        gridTemplateColumns="2fr 1fr 3fr 2fr"
        gridTemplateRows="auto"
        gridColumnGap={3}
        mb={3}
      >
        <Button onClick={() => setShowGuides(!showGuides)} variant="secondary">
          <Box display="flex" alignItems="center" justifyContent="center">
            <SVG.Ruler color={colors.nomusBlue} />
            <Box ml={2}>{showGuides ? 'Hide' : 'Show'} guides</Box>
          </Box>
        </Button>
        {/* Empty box to take up the space of the 2nd column */}
        <Box />
        <Button
          variant="secondary"
          onClick={() => setShowBothSides(!showBothSides)}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <SVG.PathBack color={colors.nomusBlue} />
            <Box ml={2}>
              {showBothSides ? 'Show one side' : 'Show both sides'}
            </Box>
          </Box>
        </Button>
        <Button
          variant="secondary"
          disabled={backContent == null || showBothSides}
          onClick={() => setShowBack(!showBack)}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <SVG.Sync color={colors.nomusBlue} />
            <Box ml={2}>Flip to {showBack ? 'front' : 'back'}</Box>
          </Box>
        </Button>
      </Box>

      <Box
        placeSelf="center center"
        width="100%"
        // height="100%"
        display="grid"
        gridTemplateColumns={showBothSides ? '1fr 1fr' : '1fr'}
        gridColumnGap={2}
      >
        {(!showBack || showBothSides) && (
          <CardWithGuides innerContent={frontContent} showGuides={showGuides} />
        )}
        {(showBack || showBothSides) && (
          <CardWithGuides innerContent={backContent} showGuides={showGuides} />
        )}
      </Box>

      {showGuides ? (
        <Box
          display="grid"
          gridTemplateColumns="1fr 6fr 1fr"
          mt={4}
          width="100%"
          placeSelf="end center"
        >
          <Box gridColumn="2/3">
            <CardBuilderPreviewLegend />
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}

export default CardBuilderPreview
