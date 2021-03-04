import { mq } from '../breakpoints'
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
      borderColor: '#DFE5EC',
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
  knob: {
    fontSize: '16px',
    [mq.md]: {
      fontSize: '20px',
    },
    borderRadius: '2em',
    padding: '13px',
  },
  normal: {
    paddingTop: '9.5px',
    paddingBottom: '9.5px',
    fontSize: '14px',
    borderRadius: '8px',
  },
}
