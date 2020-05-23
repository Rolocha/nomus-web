import colors from '../colors'
import typography from '../typography'
const { textStyles } = typography

// Defining button styles centrally here since both <a /> and <button /> will consume them

export const baseButtonStyles = {
  padding: '8px 16px',
  borderRadius: '6px',
  borderWidth: '2px',
  borderStyle: 'solid',
  fontFamily: textStyles.body.fontFamily,
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
  textAlign: 'center',
} as const

export const styleVariants = {
  primary: {
    backgroundColor: colors.primaryTeal,
    borderColor: colors.primaryTeal,
    color: colors.bgBeige,
  },
  primaryOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.primaryTeal,
    color: colors.primaryTeal,
  },

  secondary: {
    backgroundColor: colors.secondaryTeal,
    borderColor: colors.secondaryTeal,
    color: colors.bgBeige,
  },
  secondaryOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.secondaryTeal,
    color: colors.secondaryTeal,
  },

  success: {
    backgroundColor: colors.validGreen,
    borderColor: colors.validGreen,
    color: colors.bgBeige,
  },
  successOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.validGreen,
    color: colors.validGreen,
  },

  warning: {
    backgroundColor: colors.primaryGold,
    borderColor: colors.primaryGold,
    color: colors.bgBeige,
  },
  warningOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.primaryGold,
    color: colors.primaryGold,
  },

  danger: {
    backgroundColor: colors.terraCotta,
    borderColor: colors.terraCotta,
    color: colors.bgBeige,
  },
  dangerOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.terraCotta,
    color: colors.terraCotta,
  },

  light: {
    backgroundColor: colors.bgBeige,
    borderColor: colors.bgBeige,
    color: colors.textGray,
  },
  lightOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.bgBeige,
    color: colors.bgBeige,
  },

  plainButLightOnHover: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: colors.primaryTeal,
    boxShadow: 'none',
    transition:
      '0.3s ease background-color, 0.3s ease border-color, 0.3s ease color, 0.3s ease boxShadow',
    '&:hover': {
      backgroundColor: colors.bgBeige,
      borderColor: colors.bgBeige,
      color: colors.primaryTeal,
      boxShadow: baseButtonStyles.boxShadow,
    },
  },
} as const

export const widthVariants = {
  full: {
    width: '100%',
  },
  auto: {},
}
