import { extendTheme } from '@chakra-ui/react'
import colors from './colors'
import typography from './typography'
import breakpoints, { chakraBreakpoints } from './breakpoints'
import shadows from './shadows'

export const theme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  radii: [0, 4, 8, 16, 32],
  fontSizes: [18, 20, 24, 54],
  fontFamilies: typography.fontFamilies,
  textStyles: typography.textStyles,
  colors,
  breakpoints,
  shadows,
}

const chakraThemeConfig = {
  colors,
  breakpoints: chakraBreakpoints,
}

export const chakraTheme = extendTheme(chakraThemeConfig)

export default theme
