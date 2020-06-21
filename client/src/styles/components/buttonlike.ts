import colors from '../colors'
import typography from '../typography'
const { fontFamilies } = typography

// Defining button styles centrally here since both <a /> and <button /> will consume them

export const baseButtonStyles = {
  padding: '8px 16px',
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
    ...baseButtonStyles,
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
    ...baseButtonStyles,
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
    ...baseButtonStyles,
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

  unstyled: {},
} as const

export const widthVariants = {
  full: {
    width: '100%',
  },
  auto: {},
}

export const sizeVariants = {
  big: {
    fontSize: '20px',
    borderRadius: '2em',
  },
  normal: {
    fontSize: '14px',
    borderRadius: '8px',
  },
}
