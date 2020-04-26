import styled from '@emotion/styled'
import { variant } from 'styled-system'
import { Link as ReactRouterLink } from 'react-router-dom'

import * as buttonlikeStyles from 'styles/components/buttonlike'
import theme from 'styles/theme'

const linkBaseStyles = {
  textDecoration: 'underline',
  color: theme.colors.primaryTeal,
  fontFamily: theme.textStyles.body.fontFamily,
}

interface LinkProps {
  asButton?: boolean
  buttonStyle?: keyof typeof buttonlikeStyles.styleVariants
  width?: keyof typeof buttonlikeStyles.widthVariants
  as?: any
}

// We export both an internal and external link from this file
// They are styled identically but are based on a different
// underlying component (<a /> vs React Router's <Link />) so
// the styled component definition args are identical
const args = [
  (props: LinkProps) =>
    props.asButton
      ? { ...buttonlikeStyles.baseButtonStyles, textDecoration: 'none' }
      : linkBaseStyles,
  variant({
    // Mimic button variants with a "button-" prefix
    prop: 'buttonStyle',
    variants: buttonlikeStyles.styleVariants,
  }),
] as const

interface InternalLinkProps
  extends React.ComponentProps<typeof Link>,
    LinkProps {}

const Link = styled<'a', LinkProps>('a')(...args)
const InternalLink = styled<typeof ReactRouterLink, InternalLinkProps>(
  ReactRouterLink,
)(...args)

export { Link as ExternalLink, InternalLink }
export default Link
