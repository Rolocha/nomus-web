import * as React from 'react'
import styled from '@emotion/styled'
import {
  fontSize,
  FontSizeProps,
  fontFamily,
  FontFamilyProps,
  fontWeight,
  FontWeightProps,
  lineHeight,
  LineHeightProps,
  color,
  ColorProps,
  space,
  SpaceProps,
  variant,
} from 'styled-system'

import theme from 'src/styles/theme'

export type TextProps = {
  variant?: keyof typeof theme.textStyles
  as?: string
} & FontSizeProps &
  ColorProps &
  FontFamilyProps &
  LineHeightProps &
  FontWeightProps &
  SpaceProps

const Text = styled<'p', TextProps>('p')(
  variant({
    variants: theme.textStyles,
  }),
  fontSize,
  color,
  space,
  fontFamily,
  lineHeight,
  fontWeight,
)

Text.defaultProps = {
  variant: 'body',
}

// Custom text variants ready to be used with 'as' baked in
export const Heading = (props: React.ComponentProps<typeof Text>) => (
  <Text as="h1" variant="heading" {...props}>
    {props.children}
  </Text>
)

export const PageHeader = (props: React.ComponentProps<typeof Text>) => (
  <Text as="h2" variant="pageHeader" {...props}>
    {props.children}
  </Text>
)

export const Body = (props: React.ComponentProps<typeof Text>) => (
  <Text as="p" variant="body" {...props}>
    {props.children}
  </Text>
)
export const Caption = (props: React.ComponentProps<typeof Text>) => (
  <Text as="p" variant="caption" {...props}>
    {props.children}
  </Text>
)

export const Link = styled(Text.withComponent('a'))`
  cursor: pointer;
`
Link.defaultProps = {
  ...theme.textStyles.link,
}
