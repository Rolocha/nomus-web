import * as React from 'react'
import styled from '@emotion/styled'
import isPropValid from '@emotion/is-prop-valid'
import {
  baseButtonStyles,
  sizeVariants,
  styleVariants,
} from 'src/styles/components/buttonlike'
import * as Text from 'src/components/Text'
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
  as?: string
} & SpaceProps &
  LayoutProps &
  GridProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>

export const InternalButton = styled<'button', InternalButtonProps>('button', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'size',
})(
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
  ({ size, ...props }) => layout(props),
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
      ...internalProps
    }: ButtonProps,
    ref,
  ) => {
    return (
      <InternalButton
        {...internalProps}
        ref={ref as React.MutableRefObject<HTMLButtonElement>}
        disabled={inProgress || disabled}
      >
        {inProgress ? (
          <Box display="flex" alignItems="center">
            <Spinner size="1em" />
            <Text.Plain ml={1}>{inProgressText || children}</Text.Plain>
          </Box>
        ) : (
          children
        )}
      </InternalButton>
    )
  },
)

Button.defaultProps = {
  inProgress: false,
}

export default Button
export { styleVariants }
