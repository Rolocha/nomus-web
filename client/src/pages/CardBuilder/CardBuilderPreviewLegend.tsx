import { css } from '@emotion/react'
import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'

const CardBuilderPreviewLegend = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr 1fr 1fr"
      gridColumnGap={3}
      css={css`
        text-align: center;
        ${Box} {
          // Align text in center of boxes
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}
    >
      <Box bg="#FBDD9D" p={2}>
        <Text.Body2>bleed</Text.Body2>
      </Box>
      <Box border="2px solid #444" p={2}>
        <Text.Body2>business card</Text.Body2>
      </Box>
      <Box border={`2px dashed ${colors.brightCoral}`} p={2}>
        <Text.Body2>text-safe space</Text.Body2>
      </Box>
    </Box>
  )
}

export default CardBuilderPreviewLegend
