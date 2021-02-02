import { css } from '@emotion/react'
import * as React from 'react'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import { colors } from 'src/styles'
import Box from './Box'

interface Props {
  type: 'success' | 'warning' | 'danger' | 'info'
  title: string
  description: React.ReactNode
  className?: string
  closable?: boolean
  onClickClose?: () => void
}

const Banner = ({
  type,
  title,
  className,
  description,
  closable,
  onClickClose,
}: Props) => {
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
      className={className}
      position="relative"
      borderRadius={2}
      display="flex"
      alignItems="center"
      boxShadow="banner"
      bg={colors.white}
    >
      <Box
        bg={color}
        width="8px"
        alignSelf="stretch"
        borderTopLeftRadius={2}
        borderBottomLeftRadius={2}
      />
      <Box
        display="grid"
        gridTemplateColumns={closable ? 'auto auto' : 'auto'}
        gridColumnGap={2}
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Box display="flex">
          <Icon color={color} css={css({ marginRight: '8px' })} />
          <Text.Body2>
            <span css={css({ fontWeight: 500, marginRight: '8px' })}>
              {title}
            </span>
            {description}
          </Text.Body2>
        </Box>
        {closable && (
          <Box
            cursor="pointer"
            role="button"
            aria-label="close banner"
            onClick={onClickClose}
          >
            <SVG.Close color={colors.midnightGray} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Banner
