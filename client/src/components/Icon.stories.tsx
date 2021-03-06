import React from 'react'

import Icon, { iconNames } from 'src/components/Icon'
import { colors } from 'src/styles'
import * as Text from 'src/components/Text'
import Box from 'src/components/Box'

export default {
  title: 'components/Icon',
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
            borderRadius="lg"
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

export const ResponsivelyStyledIcon = () => {
  return (
    <>
      <Text.Body2>
        Here are all the icons styled with one color in mobile, another in
        desktop.
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
            borderRadius="lg"
            width="125px"
            height="125px"
          >
            <Icon
              of={iconName}
              color={{ base: colors.poppy, md: colors.activeGreen }}
            />
            <Text.Body3 mt={2}>{iconName}</Text.Body3>
          </Box>
        ))}
      </Box>
    </>
  )
}
