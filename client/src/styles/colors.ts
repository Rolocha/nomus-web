// Some colors appear more than once to provide useful alternate aliases
const colors = {
  // Primary
  nomusBlue: '#295689',
  primaryBlue: '#295689',
  gold: '#EEB941',

  golden: {
    50: '#FFFCF5',
    100: '#FEF8EB',
    200: '#FDF1D8',
    300: '#FDEBC4',
    400: '#FBDD9D',
    500: '#FACF76',
    600: '#F8C24F',
    700: '#F7BB3B',
    800: '#C6962F',
    900: '#947023',
  },

  blue: {
    50: '#E5EEF7',
    100: '#E5EEF7',
    200: '#E5EEF7',
    300: '#CCDDF0',
    400: '#99BAE0',
    500: '#6698D1',
    600: '#3876BC',
    700: '#295689', // nomusBlue
    800: '#21456e',
    900: '#193452',
  },
  // Secondary
  twilight: '#14355A',
  secondaryBlue: '#14355A',
  brightCoral: '#FF7057',
  cyanProcess: '#02ABE8',

  // Text
  midnightGray: '#444444',
  africanElephant: '#A9A591',

  // Some grays
  lightGray: '#E0E0DE',
  superlightGray: '#E5E5E5',
  white: '#FFFFFF',

  // States
  linkBlue: '#3C98C0',
  invalidRed: '#B91600',
  validGreen: '#62AD00',
  disabledBlue: '#8598AD',

  // Other Colors
  poppy: '#EA9C00',
  viridianGreen: '#067D78',

  // Backgrounds
  ivory: '#FBF9F0',
  offWhite: '#FDFCF7',

  // Buttons
  hoverBlue: '#224B79',
  hoverSecondaryBlue: '#F0F7FF',
  activeBlue: '#14355A',
  activeSecondaryBlue: '#E5F1FF',
  outlineBlue: '#B2D6FF',

  hoverRed: '#B01500',
  hoverSecondaryRed: '#FFF2F0',
  activeRed: '#9E1300',
  activeSecondaryRed: '#FFE9E5',

  hoverGreen: '#5A9E00',
  hoverSecondaryGreen: '#F8FFF0',
  activeGreen: '#549400',
  activeSecondaryGreen: '#F3FFE5',
} as const

export type ColorName = keyof typeof colors
export type ColorValue = typeof colors[ColorName]

export default colors
