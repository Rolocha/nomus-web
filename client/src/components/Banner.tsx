import { css } from '@emotion/core'
import * as React from 'react'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import { colors } from 'src/styles'
import Box from './Box'

interface Props {
  type: 'success' | 'warning' | 'danger' | 'info'
  title: string
  description: string
}

const Banner = ({ type, title, description }: Props) => {
  const color = {
    success: colors.validGreen,
    warning: colors.poppy,
    danger: colors.invalidRed,
    info: colors.nomusBlue,
  }[type]

  const Icon = {
    success: SVG.CheckO,
    warning: SVG.ExclamationO,
    danger: SVG.SlashO,
    info: SVG.InfoO,
  }[type]

  return (
    <Box
      position="relative"
      borderRadius={3}
      display="flex"
      alignItems="center"
      boxShadow="banner"
    >
      <Box
        bg={color}
        width="8px"
        alignSelf="stretch"
        borderTopLeftRadius={3}
        borderBottomLeftRadius={3}
      />
      <Box display="flex" p={3}>
        <Icon color={color} css={css({ marginRight: '8px' })} />
        <Text.Body2>
          <span css={css({ fontWeight: 'bold', marginRight: '8px' })}>
            {title}
          </span>
          {description}
        </Text.Body2>
      </Box>
    </Box>
  )
}

export default Banner
