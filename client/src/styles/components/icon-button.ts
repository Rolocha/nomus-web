import * as buttonStyles from './button'

export const sizeVariants = {
  normal: {
    padding: '9.5px',
    // fontSize: '14px',
    // borderRadius: '8px',
  },
}

export default {
  colorSchemes: {},
  baseStyle: {},
  sizes: sizeVariants,
  variants: buttonStyles.styleVariants,
  defaultProps: {
    size: 'normal',
    variant: 'primary',
  },
}
