import { Button } from '@chakra-ui/react'
import * as React from 'react'

type Omitted =
  | 'leftIcon'
  | 'isFullWidth'
  | 'rightIcon'
  | 'loadingText'
  | 'iconSpacing'

interface BaseButtonProps
  extends Omit<React.ComponentProps<typeof Button>, Omitted> {}

export interface IconButtonProps extends BaseButtonProps {
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
    const { icon, children, isRound, 'aria-label': ariaLabel, ...rest } = props

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
      <Button
        size="icon"
        borderRadius={isRound ? 'full' : 'md'}
        ref={ref}
        aria-label={ariaLabel}
        {...rest}
      >
        {_children}
      </Button>
    )
  },
)

export default IconButton
