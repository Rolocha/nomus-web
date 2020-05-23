import colors from './colors'
import typography from './typography'
import breakpoints from './breakpoints'

const theme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  radii: [0, 4, 8, 16, 32],
  fontSizes: [18, 20, 24, 54],
  fontFamilies: typography.fontFamilies,
  textStyles: typography.textStyles,
  colors,
  breakpoints,
  shadows: ['0px 0px 4px rgba(0, 0, 0, 0.25)'],
}

export default theme
