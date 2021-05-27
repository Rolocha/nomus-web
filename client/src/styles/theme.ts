import { createBreakpoints } from '@chakra-ui/theme-tools'
import { extendTheme } from '@chakra-ui/react'
import colors from './colors'
import typography from './typography'
import { breakpoints } from './breakpoints'
import shadows from './shadows'
import radii from './radii'
import buttonStyles from './components/button'
import iconButtonStyles from './components/icon-button'
import switchStyles from './components/switch'

export default extendTheme({
  colors,
  radii,
  breakpoints: createBreakpoints(breakpoints),
  shadows,
  textStyles: typography.textStyles,
  fonts: typography.fonts,
  components: {
    Button: buttonStyles,
    IconButton: iconButtonStyles,
    Switch: switchStyles,
  },
})
