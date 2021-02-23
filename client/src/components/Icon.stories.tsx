import React from 'react'

import Icon, { iconNames } from 'src/components/Icon'
import { colors } from 'src/styles'
import * as Text from 'src/components/Text'
import Box from 'src/components/Box'

export default {
  title: 'Icon',
  component: Icon,
  excludeStories: /.*Data$/,
}

export const AllIcons = () => {
  return (
    <>
      <Box display="flex" flexWrap="wrap" mx={-2}>
        {iconNames.map((iconName) => (
          <Box
            key={iconName}
            p={3}
            m={2}
            bg={colors.superlightGray}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderRadius={2}
            width="125px"
            height="125px"
          >
            <Icon of={iconName} />
            <Text.Body3 mt={2}>{iconName}</Text.Body3>
          </Box>
        ))}
      </Box>
    </>
  )
}

export const StyledIcon = () => {
  return (
    <>
      <Text.Body2>
        Here are all the icons styled with the poppy color and made to be size
        50!
      </Text.Body2>
      <Box display="flex" flexWrap="wrap" mx={-2}>
        {iconNames.map((iconName) => (
          <Box
            key={iconName}
            p={3}
            m={2}
            bg={colors.superlightGray}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderRadius={2}
            width="125px"
            height="125px"
          >
            <Icon of={iconName} color={colors.poppy} boxSize="50px" />
            <Text.Body3 mt={2}>{iconName}</Text.Body3>
          </Box>
        ))}
      </Box>
    </>
  )
}
