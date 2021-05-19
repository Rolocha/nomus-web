import { mq } from '../breakpoints'
import colors from '../colors'
import typography from '../typography'
const { fonts } = typography

// Defining button styles centrally here since both <a /> and <button /> will consume them

export const baseButtonStyles = {
  fontFamily: fonts.rubik,
  letterSpacing: '0.02em',
  fontWeight: 500,
  cursor: 'pointer',
  border: 'none',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  '&:disabled': {
    cursor: 'not-allowed',
  },
} as const

const buttonTransition = [
  'color',
  'background-color',
  'border-color',
  'box-shadow',
  'outline',
]
  .map((prop) => `0.3s ease ${prop}`)
  .join(', ')

const makePrimaryVariant = (
  colorScheme: Record<number, string>,
  textColor: 'light' | 'dark',
) => ({
  borderWidth: '1px',
  borderStyle: 'solid',
  backgroundColor: colorScheme[700],
  borderColor: colorScheme[700],
  color: textColor === 'light' ? colors.ivory : colors.midnightGray,
  transition: buttonTransition,
  '&:hover': {
    backgroundColor: colorScheme[800],
    borderColor: colorScheme[800],
  },
  '&:active': {
    backgroundColor: colorScheme[900],
    borderColor: colorScheme[900],
  },
  '&:focus': {
    boxShadow: `0 0 4px 0 ${colorScheme[500]}`,
    outline: 'none',
  },
  '&:disabled': {
    backgroundColor: '#DFE5EC',
    color: colors.disabledBlue,
    borderColor: '#DFE5EC',
  },
})

export const styleVariants = {
  primary: makePrimaryVariant(colors.blue, 'light'),
  golden: makePrimaryVariant(colors.golden, 'dark'),

  secondary: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderColor: colors.nomusBlue,
    color: colors.nomusBlue,
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverSecondaryBlue,
    },
    '&:active': {
      backgroundColor: colors.activeSecondaryBlue,
    },
    '&:focus': {
      boxShadow: `0 0 4px 0 ${colors.outlineBlue}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: colors.disabledBlue,
      borderColor: colors.disabledBlue,
    },
  },

  tertiary: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: colors.nomusBlue,
    boxShadow: 'none',
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverSecondaryBlue,
    },
    '&:active': {
      backgroundColor: colors.activeSecondaryBlue,
    },
    '&:focus': {
      boxShadow: `0 0 4px 0 ${colors.outlineBlue}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: colors.disabledBlue,
    },
  },

  danger: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: colors.invalidRed,
    borderColor: colors.invalidRed,
    color: colors.white,
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverRed,
    },
    '&:active': {
      backgroundColor: colors.activeRed,
    },
    '&:focus': {
      boxShadow: `0 0 4px 0 ${colors.outlineBlue}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: '#DFE5EC',
      color: colors.disabledBlue,
      borderColor: '#DFE5EC',
    },
  },

  dangerSecondary: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'white',
    borderColor: colors.invalidRed,
    color: colors.invalidRed,
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverSecondaryRed,
    },
    '&:active': {
      backgroundColor: colors.activeSecondaryRed,
    },
    '&:focus': {
      backgroundColor: colors.hoverSecondaryRed,
      boxShadow: `0 0 4px 0 ${colors.outlineBlue}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: 'white',
      color: colors.disabledBlue,
      borderColor: colors.disabledBlue,
    },
  },

  dangerTertiary: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: colors.invalidRed,
    boxShadow: 'none',
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverSecondaryRed,
    },
    '&:active': {
      backgroundColor: colors.activeSecondaryRed,
    },
    '&:focus': {
      backgroundColor: colors.hoverSecondaryRed,
      boxShadow: `0 0 4px 0 ${colors.outlineBlue}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: colors.disabledBlue,
    },
  },

  success: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: colors.validGreen,
    borderColor: colors.validGreen,
    color: colors.white,
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverGreen,
    },
    '&:active': {
      backgroundColor: colors.activeGreen,
    },
    '&:focus': {
      boxShadow: `0 0 4px 0 ${colors.outlineBlue}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: '#DFE5EC',
      color: colors.disabledBlue,
      borderColor: '#DFE5EC',
    },
  },

  successSecondary: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'white',
    borderColor: colors.validGreen,
    color: colors.validGreen,
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverSecondaryGreen,
    },
    '&:active': {
      backgroundColor: colors.activeSecondaryGreen,
    },
    '&:focus': {
      boxShadow: `0 0 4px 0 ${colors.outlineBlue}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: 'white',
      color: colors.disabledBlue,
      borderColor: colors.disabledBlue,
    },
  },

  successTertiary: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: colors.validGreen,
    boxShadow: 'none',
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverSecondaryGreen,
    },
    '&:active': {
      backgroundColor: colors.activeSecondaryGreen,
    },
    '&:focus': {
      backgroundColor: colors.hoverSecondaryGreen,
      boxShadow: `0 0 4px 0 ${colors.outlineBlue}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: colors.disabledBlue,
    },
  },

  dashedSecondary: {
    borderWidth: '1px',
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    borderColor: colors.nomusBlue,
    color: colors.nomusBlue,
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverSecondaryBlue,
    },
    '&:active': {
      backgroundColor: colors.activeSecondaryBlue,
    },
    '&:focus': {
      boxShadow: `0 0 4px 0 ${colors.outlineBlue}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: colors.disabledBlue,
      borderColor: colors.disabledBlue,
    },
  },

  unstyled: {},
} as const

export const sizeVariants = {
  big: {
    fontSize: '16px',
    [mq.md]: {
      fontSize: '20px',
    },
    borderRadius: '2em',
    paddingTop: '13px',
    paddingBottom: '13px',
  },
  normal: {
    paddingTop: '9.5px',
    paddingBottom: '9.5px',
    fontSize: '14px',
    borderRadius: '8px',
  },
  icon: {
    padding: '9.5px',
  },
}

export default {
  colorSchemes: {},
  baseStyle: baseButtonStyles,
  sizes: sizeVariants,
  variants: styleVariants,
  defaultProps: {
    size: 'normal',
    variant: 'primary',
  },
}
