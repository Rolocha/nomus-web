import { chakra, PropsOf, useStyleConfig } from '@chakra-ui/system'
import * as React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import * as buttonStyles from 'src/styles/components/button'
import theme from 'src/styles/theme'

interface LinkProps extends PropsOf<typeof chakra.a> {
  // We use `to` for both internal and external links so we don't have to think about which one we're using
  to?: React.ComponentProps<typeof ReactRouterLink>['to'] | null
  ref?: any
  buttonStyle?: keyof typeof buttonStyles.styleVariants
  buttonSize?: keyof typeof buttonStyles.sizeVariants
  underline?: boolean
  color?: string
  as?: any
  overrideStyles?: any
  linkType?: 'internal' | 'external'
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
const Link = ({
  to,
  ref,
  defaultValue,
  referrerPolicy,
  linkType,
  buttonSize = undefined,
  buttonStyle = undefined,
  ...props
}: LinkProps) => {
  // Piggy-back on button style variants
  const buttonStyles = useStyleConfig('Button', {
    size: buttonSize,
    variant: buttonStyle,
  })

  const styles = {
    textDecoration: props.underline ? 'underline' : 'none',
    color: props.color ?? theme.colors.linkBlue,
    cursor: 'pointer',
    ...(buttonSize || buttonStyle ? buttonStyles : {}),
  }

  if (
    to == null ||
    isExternalLink(to) ||
    (typeof to === 'string' && linkType && linkType === 'external')
  ) {
    // Link is pointing to some other website/location, use the typical anchor element
    return <chakra.a ref={ref} sx={styles} href={to ?? '#'} {...props} />
  } else {
    // Link is pointing to within our app, use the Internal (React Router) version
    return (
      <chakra.a as={ReactRouterLink} ref={ref} sx={styles} to={to} {...props} />
    )
  }
}

export default Link

export const ExternalLink = (props: LinkProps) => (
  <Link {...props} linkType="external" />
)
