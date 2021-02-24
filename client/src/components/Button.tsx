import * as React from 'react'
import styled from '@emotion/styled'
import isPropValid from '@emotion/is-prop-valid'
import {
  baseButtonStyles,
  sizeVariants,
  styleVariants,
} from 'src/styles/components/buttonlike'
import theme from 'src/styles/theme'
import {
  grid,
  GridProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  variant,
} from 'styled-system'
import Spinner from './Spinner'
import Box from './Box'

type InternalButtonProps = {
  variant?: keyof typeof styleVariants
  size?: keyof typeof sizeVariants
  as?: any
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
} & SpaceProps &
  LayoutProps &
  GridProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>

export const InternalButton = styled('button', {
  shouldForwardProp: (prop) =>
    typeof prop === 'string' && isPropValid(prop) && prop !== 'size',
})<InternalButtonProps>(
  baseButtonStyles,
  space,
  grid,
  variant({ variants: styleVariants }),
  variant({
    prop: 'size',
    variants: sizeVariants,
  }),
  // The 'layout' set of styles already has a "size" property that sets both width and height
  // but we have our own custom "size" prop for Button so we want to exclude that
  ({ size, ...props }: InternalButtonProps) => layout(props),
)

InternalButton.defaultProps = {
  color: theme.colors.ivory,
  variant: 'primary',
  size: 'normal',
}

type ButtonProps = InternalButtonProps & {
  inProgress?: boolean
  inProgressText?: string
}

const Button = React.forwardRef(
  (
    {
      inProgress,
      children,
      disabled,
      inProgressText,
      leftIcon,
      rightIcon,
      ...internalProps
    }: ButtonProps,
    ref,
  ) => {
    const contents = [
      inProgress && (
        <Box as="span">
          <Spinner size="1em" />
        </Box>
      ),
      leftIcon && <Box as="span">{leftIcon}</Box>,
      inProgress && inProgressText ? inProgressText : children,
      rightIcon,
    ].filter(Boolean)

    return (
      <InternalButton
        {...internalProps}
        ref={ref as React.MutableRefObject<HTMLButtonElement>}
        disabled={inProgress || disabled}
      >
        <Box
          display="grid"
          alignItems="center"
          gridTemplateColumns={`repeat(${contents.length}, auto)`}
          gridColumnGap={1}
        >
          {contents}
        </Box>
      </InternalButton>
    )
  },
)

Button.defaultProps = {
  inProgress: false,
}

export default Button
export { styleVariants }
