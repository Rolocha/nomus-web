import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { Link as ReactRouterLink } from 'react-router-dom'
import * as buttonlikeStyles from 'src/styles/components/buttonlike'
import theme from 'src/styles/theme'
import { variant } from 'styled-system'

const linkBaseStyles = (props: LinkProps) => ({
  textDecoration: props.noUnderline ? 'none' : 'underline',
  color: props.color ?? theme.colors.primaryTeal,
  fontFamily: theme.textStyles.body.fontFamily,
})

interface LinkProps {
  asButton?: boolean
  buttonStyle?: keyof typeof buttonlikeStyles.styleVariants
  width?: keyof typeof buttonlikeStyles.widthVariants
  noUnderline?: boolean
  color?: string
  as?: any
  overrideStyles?: any
}

// We export both an internal and external link from this file
// They are styled identically but are based on a different
// underlying component (<a /> vs React Router's <Link />) so
// the styled component definition args are identical
const args = [
  (props: LinkProps) =>
    props.asButton
      ? { ...buttonlikeStyles.baseButtonStyles, textDecoration: 'none' }
      : linkBaseStyles(props),
  variant({
    // Mimic button variants with a "button-" prefix
    prop: 'buttonStyle',
    variants: buttonlikeStyles.styleVariants,
  }),
  (props: LinkProps) => props.overrideStyles,
] as const

interface InternalLinkProps
  extends React.ComponentProps<typeof Link>,
    LinkProps {}

const Link = styled<'a', LinkProps>('a', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'noUnderline',
})(...args)
const InternalLink = styled<typeof ReactRouterLink, InternalLinkProps>(
  ReactRouterLink,
  { shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'noUnderline' },
)(...args)

export { Link as ExternalLink, InternalLink }
export default Link
