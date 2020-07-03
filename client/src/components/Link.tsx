import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { Link as ReactRouterLink } from 'react-router-dom'
import * as buttonlikeStyles from 'src/styles/components/buttonlike'
import theme from 'src/styles/theme'

const linkBaseStyles = (props: LinkProps) => ({
  textDecoration: props.underline ? 'underline' : 'none',
  color: props.color ?? theme.colors.linkBlue,
})

interface LinkProps {
  asButton?: boolean
  // button variants are only used if asButton is true
  buttonStyle?: keyof typeof buttonlikeStyles.styleVariants
  buttonSize?: keyof typeof buttonlikeStyles.sizeVariants

  width?: keyof typeof buttonlikeStyles.widthVariants
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
  extends React.ComponentProps<typeof Link>,
    LinkProps {}

const Link = styled<'a', LinkProps>('a', {
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
Link.defaultProps = defaultProps
InternalLink.defaultProps = defaultProps

export { Link as ExternalLink, InternalLink }
export default Link
