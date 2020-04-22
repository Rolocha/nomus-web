import styled from '@emotion/styled'
import { variant } from 'styled-system'

import theme from 'styles/theme'

type ButtonProps = {
  variant?: keyof typeof styleVariants
  width?: keyof typeof widthVariants
  as?: string
}

const styleVariants = {
  primary: {
    backgroundColor: theme.colors.validGreen,
    borderColor: theme.colors.validGreen,
    color: theme.colors.offWhite,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.validGreen,
    color: theme.colors.validGreen,
  },
  secondaryLight: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.offWhite,
    color: theme.colors.offWhite,
  },
  blue: {
    backgroundColor: theme.colors.primaryTeal,
    borderColor: theme.colors.primaryTeal,
    color: theme.colors.offWhite,
  },
} as const

const widthVariants = {
  full: {
    width: '100%',
  },
  auto: {},
}

const Button = styled<'button', ButtonProps>('button')(
  {
    padding: '10px 20px',
    borderRadius: '6px',
    borderWidth: '2px',
    borderStyle: 'solid',
    fontFamily: theme.textStyles.body.fontFamily,
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    a: {
      textDecoration: 'none',
      color: 'unset',
    },
  },
  variant({
    variants: styleVariants,
  }),
  variant({
    prop: 'width',
    variants: widthVariants,
  }),
)

Button.defaultProps = {
  color: theme.colors.offWhite,
  variant: 'primary',
  width: 'auto',
}

export default Button
