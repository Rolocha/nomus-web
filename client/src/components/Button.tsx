// 1. Import useStyleConfig
import { chakra, useStyleConfig } from '@chakra-ui/react'
import * as React from 'react'
import { sizeVariants, styleVariants } from 'src/styles/components/button'
import Box from './Box'
import Spinner from './Spinner'

type ButtonProps = React.ComponentProps<typeof chakra.button> & {
  as?: any
  inProgress?: boolean
  inProgressText?: string
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  size?: keyof typeof sizeVariants
  variant?: keyof typeof styleVariants
}

const Button = React.forwardRef(
  (
    {
      children,
      disabled,
      inProgress,
      inProgressText,
      leftIcon,
      rightIcon,
      size,
      variant,
      sx,
      ...internalProps
    }: ButtonProps,
    ref,
  ) => {
    const styles = useStyleConfig('Button', { size, variant })
    const contents = [
      inProgress && <Spinner size="1em" />,
      leftIcon,
      inProgress && inProgressText ? inProgressText : children,
      rightIcon,
    ].filter(Boolean)
    return (
      <chakra.button
        sx={{ ...styles, ...sx }}
        ref={ref as React.MutableRefObject<HTMLButtonElement>}
        disabled={inProgress || disabled}
        {...internalProps}
      >
        <Box
          display="grid"
          alignItems="center"
          gridTemplateColumns={`repeat(${contents.length}, auto)`}
          gridColumnGap={1}
        >
          {contents}
        </Box>
      </chakra.button>
    )
  },
)

Button.defaultProps = {
  inProgress: false,
}

export default Button
export { styleVariants }

// const ChakraButton = (props: ButtonProps) => {
//   const { size, variant, ...rest } = props
//   // 2. Reference `Button` stored in `theme.components`
//   const styles = useStyleConfig('Button', { size, variant })
//   // 3. Pass the computed styles into the `sx` prop

//   return (
//     <chakra.button sx={styles} {...rest}>
//       <Box
//         display="grid"
//         alignItems="center"
//         gridTemplateColumns={`repeat(${contents.length}, auto)`}
//         gridColumnGap={1}
//       >
//         {contents}
//       </Box>
//     </chakra.button>
//   )
// }
