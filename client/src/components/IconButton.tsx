import { useStyleConfig } from '@chakra-ui/react'
import { chakra, PropsOf } from '@chakra-ui/system'
import * as React from 'react'

// type Omitted =
//   | 'leftIcon'
//   | 'isFullWidth'
//   | 'rightIcon'
//   | 'loadingText'
//   | 'iconSpacing'

export interface IconButtonProps extends PropsOf<typeof chakra.button> {
  /**
   * The icon to be used in the button.
   * @type React.ReactElement
   */
  icon?: React.ReactElement
  /**
   * If `true`, the button will be perfectly round. Else, it'll be slightly round
   */
  isRound?: boolean
  /**
   * A11y: A label that describes the button
   */
  'aria-label': string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const {
      icon,
      children,
      isRound,
      'aria-label': ariaLabel,
      size,
      variant,
      sx,
      ...rest
    } = props

    const styles = useStyleConfig('IconButton', { size, variant })

    /**
     * Passing the icon as prop or children should work
     */
    const element = icon || children
    const _children = React.isValidElement(element)
      ? React.cloneElement(element as any, {
          'aria-hidden': true,
          focusable: false,
        })
      : null

    return (
      <chakra.button
        sx={{ aspectRatio: '1/1', ...sx, ...styles }}
        display="inline-flex"
        justifyContent="center"
        alignItems="center"
        size="icon"
        borderRadius={isRound ? 'full' : 'md'}
        ref={ref}
        aria-label={ariaLabel}
        {...rest}
      >
        {_children}
      </chakra.button>
    )
  },
)

export default IconButton
