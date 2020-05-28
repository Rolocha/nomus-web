import styled from '@emotion/styled'
import * as React from 'react'
import theme from 'src/styles/theme'
import { baseTextStyles } from 'src/styles/typography'
import {
  color,
  ColorProps,
  fontFamily,
  FontFamilyProps,
  fontSize,
  FontSizeProps,
  fontWeight,
  FontWeightProps,
  lineHeight,
  LineHeightProps,
  space,
  SpaceProps,
  variant,
} from 'styled-system'

export type TextProps = {
  variant?: keyof typeof theme.textStyles | null
  as?: string
} & FontSizeProps &
  ColorProps &
  FontFamilyProps &
  LineHeightProps &
  FontWeightProps &
  SpaceProps

const Text = styled<'p', TextProps>('p')(
  baseTextStyles,
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

const semanticallyStyledText = (
  as: string,
  variant?: keyof typeof theme.textStyles | null,
) => (props: React.ComponentProps<typeof Text>) => (
  <Text as={as} variant={variant} {...props}>
    {props.children}
  </Text>
)

// Custom text variants ready to be used with 'as' baked in
export const Heading = semanticallyStyledText('h1', 'heading')
export const PageHeader = semanticallyStyledText('h2', 'pageHeader')
export const SectionHeader = semanticallyStyledText('h3', 'sectionHeader')
export const SectionSubheader = semanticallyStyledText('h4', 'sectionSubheader')

export const Body = semanticallyStyledText('p', 'body')
export const Body3 = semanticallyStyledText('p', 'bodyTertiary')
export const Caption = semanticallyStyledText('p', 'caption')
export const Label = semanticallyStyledText('p', 'label')
export const Plain = semanticallyStyledText('p', null)

export const Link = styled(Text.withComponent('a'))`
  cursor: pointer;
`
Link.defaultProps = {
  ...theme.textStyles.link,
}
