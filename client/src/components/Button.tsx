import styled from '@emotion/styled'
import { variant } from 'styled-system'

import {
  baseButtonStyles,
  styleVariants,
  widthVariants,
} from 'src/styles/components/buttonlike'
import theme from 'src/styles/theme'

type ButtonProps = {
  variant?: keyof typeof styleVariants
  width?: keyof typeof widthVariants
  as?: string
}

const Button = styled<'button', ButtonProps>('button')(
  baseButtonStyles,
  variant({ variants: styleVariants }),
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
