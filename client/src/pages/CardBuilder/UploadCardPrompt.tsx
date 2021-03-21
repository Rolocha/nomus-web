import { rgba } from 'polished'
import * as React from 'react'
import Box from 'src/components/Box'
import { specMeasurements } from 'src/pages/CardBuilder/config'
import { colors } from 'src/styles'

interface FallbackProps {
  innerContent: React.ReactNode
}

export const UploadCardPrompt = ({ innerContent }: FallbackProps) => {
  const { xBleed, yBleed, cardWidth, cardHeight } = specMeasurements
  const outerBleedPadding = {
    x: `calc(100% * ${xBleed / (cardWidth + xBleed * 2)})`,
    y: `calc(100% * ${yBleed / (cardHeight + yBleed * 2)})`,
  }
  const innerBleedDimensions = {
    x: `calc(100% * ${(cardWidth - xBleed * 2) / cardWidth})`,
    y: `calc(100% * ${(cardHeight - yBleed * 2) / cardHeight})`,
  }
  return (
    <Box
      width="100%"
      px={outerBleedPadding.x}
      py={outerBleedPadding.y}
      bg={rgba(colors.gold, 0.5)}
      overflow="visible"
    >
      <Box width="100%">
        <Box
          position="relative"
          border={'2px solid #444'}
          boxShadow={'businessCard'}
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
            <Box
              position="absolute"
              pointerEvents="none"
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
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default UploadCardPrompt
