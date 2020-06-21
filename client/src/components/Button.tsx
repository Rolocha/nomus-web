import styled from '@emotion/styled'
import {
  sizeVariants,
  styleVariants,
  widthVariants,
} from 'src/styles/components/buttonlike'
import theme from 'src/styles/theme'
import { space, SpaceProps, variant } from 'styled-system'

type ButtonProps = {
  variant?: keyof typeof styleVariants
  width?: keyof typeof widthVariants
  size?: keyof typeof sizeVariants
  as?: string
} & SpaceProps

const Button = styled<'button', ButtonProps>('button')(
  variant({ variants: styleVariants }),
  variant({
    prop: 'width',
    variants: widthVariants,
  }),
  variant({
    prop: 'size',
    variants: sizeVariants,
  }),
  space,
)

Button.defaultProps = {
  color: theme.colors.ivory,
  variant: 'primary',
  width: 'auto',
  size: 'normal',
}

export default Button
export { styleVariants }
