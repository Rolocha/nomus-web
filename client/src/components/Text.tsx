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

// Custom text variants with styles & semantically correct tagnames baked in
export const H1 = semanticallyStyledText('h1', 'h1')
export const BrandHeader = H1

export const H2 = semanticallyStyledText('h2', 'h2')
export const PageHeader = H2

export const H3 = semanticallyStyledText('h3', 'h3')
export const SectionHeader = H3

export const H4 = semanticallyStyledText('h4', 'h4')
export const CardHeader = H4

export const H5 = semanticallyStyledText('h5', 'h5')
export const SectionSubheader = H5

export const H6 = semanticallyStyledText('h6', 'h6')
export const MainNav = H6

export const BigBody = semanticallyStyledText('p', 'bigBody')
export const Body = semanticallyStyledText('p', 'body')
export const Body2 = semanticallyStyledText('p', 'body2')
export const Body3 = semanticallyStyledText('p', 'body3')

export const Label = semanticallyStyledText('p', 'label')
export const Plain = semanticallyStyledText('p', null)
export const Custom = Plain
