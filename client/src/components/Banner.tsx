import { css } from '@emotion/react'
import * as React from 'react'
import * as Text from 'src/components/Text'
import Icon, { IconName } from 'src/components/Icon'
import { colors } from 'src/styles'
import Box from './Box'
import { ResponsiveValue } from 'styled-system'
import { useCustomResponsiveStyles } from 'src/styles/helpers'

export type BannerBorderRadius = 'NONE' | 'DEFAULT'
export type BannerType = 'success' | 'warning' | 'danger' | 'info'
interface Props {
  type: BannerType
  title: string
  description: React.ReactNode
  className?: string
  closable?: boolean
  onClickClose?: () => void
  borderRadius?: ResponsiveValue<BannerBorderRadius>
}

const iconOptions: Record<BannerType, IconName> = {
  success: 'checkO',
  warning: 'exclamationO',
  danger: 'slashO',
  info: 'infoO',
}

const Banner = ({
  type,
  title,
  className,
  description,
  closable,
  borderRadius = 'DEFAULT',
  onClickClose,
}: Props) => {
  const color = {
    success: colors.validGreen,
    warning: colors.poppy,
    danger: colors.invalidRed,
    info: colors.nomusBlue,
  }[type]

  const outerBorderRadiusStyles = useCustomResponsiveStyles<BannerBorderRadius>(
    borderRadius,
    {
      NONE: {
        borderRadius: 0,
      },
      DEFAULT: {
        borderRadius: 2,
      },
    },
  )

  const innerBorderRadiusStyles = useCustomResponsiveStyles<BannerBorderRadius>(
    borderRadius,
    {
      NONE: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
      DEFAULT: {
        borderTopLeftRadius: 2,
        borderBottomLeftRadius: 2,
      },
    },
  )

  return (
    <Box
      className={className}
      position="relative"
      {...outerBorderRadiusStyles}
      display="flex"
      alignItems="center"
      boxShadow="banner"
      bg={colors.white}
    >
      <Box
        bg={color}
        width="8px"
        alignSelf="stretch"
        {...innerBorderRadiusStyles}
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
          <Icon of={iconOptions[type]} color={color} mr="8px" flexShrink={0} />
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
            <Icon of="close" color={colors.midnightGray} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Banner
