import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'

interface Props {
  hideBleed?: boolean
}

const CardBuilderPreviewLegend = ({ hideBleed }: Props) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${hideBleed ? 2 : 3}, 1fr)`}
      gridColumnGap={3}
      textAlign="center"
      sx={{
        div: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      {!hideBleed && (
        <Box bg="#FBDD9D" p={2}>
          <Text.Body2>bleed</Text.Body2>
        </Box>
      )}
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
