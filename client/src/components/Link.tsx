import * as React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { space, SpaceProps, layout, LayoutProps } from 'styled-system'
import { Link as ReactRouterLink } from 'react-router-dom'
import * as buttonlikeStyles from 'src/styles/components/buttonlike'
import theme from 'src/styles/theme'

const linkBaseStyles = (props: LinkProps) => ({
  textDecoration: props.underline ? 'underline' : 'none',
  color: props.color ?? theme.colors.linkBlue,
})

interface LinkProps extends SpaceProps, LayoutProps {
  asButton?: boolean
  // button variants are only used if asButton is true
  buttonStyle?: keyof typeof buttonlikeStyles.styleVariants
  buttonSize?: keyof typeof buttonlikeStyles.sizeVariants
  underline?: boolean
  color?: string
  as?: any
  overrideStyles?: any
}

// We sometimes want to style Links identically to the way we style
// Buttons so this component creates an easy-use adapter via
// the asButton, buttonStyle, and buttonSize props

// We export both an internal and external link from this file
// They are styled identically but are based on a different
// underlying component (<a /> vs React Router's <Link />) so
// the styled component definition args are identical
const args = [
  space,
  layout,
  (props: LinkProps) =>
    props.asButton
      ? {
          ...buttonlikeStyles.baseButtonStyles,
          // Mimic button variants with a "button-" prefix
          ...(props.buttonStyle
            ? buttonlikeStyles.styleVariants[props.buttonStyle]
            : {}),
          ...(props.buttonSize
            ? buttonlikeStyles.sizeVariants[props.buttonSize]
            : {}),
          textDecoration: 'none',
        }
      : linkBaseStyles(props),
  (props: LinkProps) => props.overrideStyles,
] as const

interface InternalLinkProps
  extends React.ComponentProps<typeof ExternalLink>,
    LinkProps {}

const ExternalLink = styled<'a', LinkProps>('a', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'underline',
})(...args)
const InternalLink = styled<typeof ReactRouterLink, InternalLinkProps>(
  ReactRouterLink,
  { shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'underline' },
)(...args)

const defaultProps = {
  asButton: false,
  buttonStyle: 'primary',
  buttonSize: 'normal',
} as const
ExternalLink.defaultProps = defaultProps
InternalLink.defaultProps = defaultProps

interface UnifiedLinkProps extends InternalLinkProps, LinkProps {
  to: string
  type?: 'internal' | 'external'
}

// An isomorphic Link component where the link is always passed in via the "to" prop so that you
// don't have to decide whether to pass in "to" for the react-router InternalLink or "href" for
// the traditional <a /> ExternalLink
const UnifiedLink = ({ to, type, ref, ...props }: UnifiedLinkProps) => {
  const linkTypes = {
    internal: <InternalLink {...props} to={to} />,
    external: <ExternalLink ref={ref} {...props} href={to} />,
  }
  if (type != null) {
    return linkTypes[type]
  }

  const isLinkInternal = !(to.startsWith('http') || to.startsWith('mailto'))

  return to != null && isLinkInternal
    ? // TODO: Figure out how to properly pass ref through, hasn't been necessary yet so punting on this
      linkTypes.internal
    : linkTypes.external
}

export { ExternalLink, InternalLink }
export default UnifiedLink
