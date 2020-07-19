import styled from '@emotion/styled'
import isPropValid from '@emotion/is-prop-valid'
import {
  baseButtonStyles,
  sizeVariants,
  styleVariants,
} from 'src/styles/components/buttonlike'
import theme from 'src/styles/theme'
import { layout, LayoutProps, space, SpaceProps, variant } from 'styled-system'

type ButtonProps = {
  variant?: keyof typeof styleVariants
  size?: keyof typeof sizeVariants
  as?: string
} & SpaceProps &
  LayoutProps

const Button = styled<'button', ButtonProps>('button', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'size',
})(
  baseButtonStyles,
  space,
  variant({ variants: styleVariants }),
  variant({
    prop: 'size',
    variants: sizeVariants,
  }),
  // The 'layout' set of styles already has a "size" property that sets both width and height
  // but we have our own custom "size" prop for Button so we want to exclude that
  ({ size, ...props }) => layout(props),
)

Button.defaultProps = {
  color: theme.colors.ivory,
  variant: 'primary',
  size: 'normal',
}

export default Button
export { styleVariants }
