import * as React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { space, SpaceProps, layout, LayoutProps } from 'styled-system'
import { Link as ReactRouterLink } from 'react-router-dom'
import * as buttonlikeStyles from 'src/styles/components/buttonlike'
import theme from 'src/styles/theme'

const linkBaseStyles = (props: LinkStyleProps) => ({
  textDecoration: props.underline ? 'underline' : 'none',
  color: props.color ?? theme.colors.linkBlue,
  cursor: 'pointer',
})

interface LinkStyleProps extends SpaceProps, LayoutProps {
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
  (props: LinkStyleProps) =>
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
  (props: LinkStyleProps) => props.overrideStyles,
] as const

interface InternalLinkProps
  extends React.ComponentProps<typeof ReactRouterLink>,
    LinkStyleProps {}

// @ts-ignore
const ExternalLink = styled('a', {
  shouldForwardProp: (prop: string | number | symbol) =>
    typeof prop === 'string' && isPropValid(prop) && prop !== 'underline',
})(...args)
// @ts-ignore
const InternalLink = styled(ReactRouterLink, {
  shouldForwardProp: (prop: string | number | symbol) =>
    typeof prop === 'string' && isPropValid(prop) && prop !== 'underline',
})(...args)

const defaultProps = {
  asButton: false,
  buttonStyle: 'primary',
  buttonSize: 'normal',
} as const
ExternalLink.defaultProps = defaultProps
InternalLink.defaultProps = defaultProps

interface UnifiedLinkProps
  extends Omit<InternalLinkProps, 'to'>,
    LinkStyleProps {
  to: React.ComponentProps<typeof ReactRouterLink>['to'] | null
  type?: 'internal' | 'external'
  ref?: any
}

const isExternalLink = (
  to: React.ComponentProps<typeof ReactRouterLink>['to'],
): to is string => {
  return (
    typeof to === 'string' &&
    (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:'))
  )
}

// An isomorphic Link component where the link is always passed in via the "to" prop so that you
// don't have to decide whether to pass in "to" for the react-router InternalLink or "href" for
// the traditional <a /> ExternalLink
const UnifiedLink = ({
  to,
  ref,
  defaultValue,
  referrerPolicy,
  ...props
}: UnifiedLinkProps) => {
  if (to == null || isExternalLink(to)) {
    // @ts-ignore
    return <ExternalLink ref={ref} {...props} href={to} />
  } else {
    return (
      <InternalLink
        {...props}
        // @ts-ignore
        to={to}
        defaultValue={defaultValue}
        referrerPolicy={referrerPolicy}
      />
    )
  }
}

export { ExternalLink, InternalLink, UnifiedLink as Link }
export default UnifiedLink
