import { chakra } from '@chakra-ui/system'
import * as React from 'react'
import typography from 'src/styles/typography'

export type TextProps = React.ComponentProps<typeof chakra.p>

const semanticallyStyledText = (
  as: React.ElementType<any>,
  variant?: keyof typeof typography.textStyles,
) => (props: TextProps) => {
  const TextComponent = chakra(as)
  return <TextComponent textStyle={variant} {...props} />
}

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

export const Body = semanticallyStyledText('p', 'body')
export const Body2 = semanticallyStyledText('p', 'body2')
export const Body3 = semanticallyStyledText('p', 'body3')

export const Label = semanticallyStyledText('p', 'label')
export const Plain = semanticallyStyledText('p', 'plain')
