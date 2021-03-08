import React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'

export default {
  title: 'styles/Color',
  excludeStories: /.*Data$/,
}

export const Colors = () => {
  const colorNames = Object.keys(colors) as (keyof typeof colors)[]
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(4, 1fr)"
      gridColumnGap={2}
      gridRowGap={2}
    >
      {colorNames.map((colorName) => (
        <Box m={2} display="flex">
          <Box
            border={`1px solid ${colors.superlightGray}`}
            mr={2}
            bgColor={colorName}
            width="50px"
            height="50px"
            borderRadius="base"
          />
          <Box>
            <Text.Body2 fontWeight={500}>{colorName}</Text.Body2>
            <Text.Body2>{colors[colorName]}</Text.Body2>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
