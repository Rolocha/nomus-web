import colors from '../colors'
import typography from '../typography'
const { fontFamilies } = typography

// Defining button styles centrally here since both <a /> and <button /> will consume them

export const baseButtonStyles = {
  fontFamily: fontFamilies.rubik,
  letterSpacing: '0.02em',
  fontWeight: 500,
  cursor: 'pointer',
  border: 'none',
  textAlign: 'center',
  outline: 'none',
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

export const styleVariants = {
  primary: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: colors.nomusBlue,
    borderColor: colors.nomusBlue,
    color: colors.ivory,
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: '#224B79',
      borderColor: '#224B79',
    },
    '&:active': {
      backgroundColor: colors.twilight,
      borderColor: colors.twilight,
    },
    '&:focus': {
      boxShadow: `0 0 4px 0 ${colors.outlineBlue}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: '#DFE5EC',
      color: colors.disabledBlue,
    },
  },

  secondary: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderColor: colors.nomusBlue,
    color: colors.nomusBlue,
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverBlue,
    },
    '&:active': {
      backgroundColor: colors.activeBlue,
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
      backgroundColor: colors.hoverBlue,
    },
    '&:active': {
      backgroundColor: colors.activeBlue,
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
    backgroundColor: 'transparent',
    borderColor: colors.invalidRed,
    color: colors.invalidRed,
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverRed,
    },
    '&:active': {
      backgroundColor: colors.activeRed,
    },
    '&:focus': {
      boxShadow: `0 0 4px 0 ${colors.outlineRed}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: colors.invalidRed,
      borderColor: colors.invalidRed,
    },
  },

  success: {
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderColor: colors.validGreen,
    color: colors.validGreen,
    transition: buttonTransition,
    '&:hover': {
      backgroundColor: colors.hoverGreen,
    },
    '&:active': {
      backgroundColor: colors.activeGreen,
    },
    '&:focus': {
      boxShadow: `0 0 4px 0 ${colors.outlineGreen}`,
      outline: 'none',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: colors.validGreen,
      borderColor: colors.validGreen,
    },
  },

  unstyled: {},
} as const

export const sizeVariants = {
  big: {
    fontSize: '20px',
    borderRadius: '2em',
  },
  normal: {
    paddingTop: '11.5px',
    paddingBottom: '11.5px',
    fontSize: '14px',
    borderRadius: '8px',
  },
}
