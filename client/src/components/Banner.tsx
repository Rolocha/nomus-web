import * as React from 'react'
import Icon, { IconName } from 'src/components/Icon'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { useCustomResponsiveStyles } from 'src/styles/helpers'
import { ResponsiveValue } from 'styled-system'
import Box from './Box'

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
        borderRadius: 'none',
      },
      DEFAULT: {
        borderRadius: 'md',
      },
    },
  )

  const innerBorderRadiusStyles = useCustomResponsiveStyles<BannerBorderRadius>(
    borderRadius,
    {
      NONE: {
        borderTopLeftRadius: 'none',
        borderBottomLeftRadius: 'base',
      },
      DEFAULT: {
        borderTopLeftRadius: 'none',
        borderBottomLeftRadius: 'base',
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
            <Box as="span" fontWeight={500} mr="8px">
              {title}
            </Box>
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
