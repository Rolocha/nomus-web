import colors from '../colors'
import typography from '../typography'
const { textStyles } = typography

// Defining button styles centrally here since both <a /> and <button /> will consume them

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
} as const

export const widthVariants = {
  full: {
    width: '100%',
  },
  auto: {},
}

export const baseButtonStyles = {
  padding: '10px 20px',
  borderRadius: '6px',
  borderWidth: '2px',
  borderStyle: 'solid',
  fontFamily: textStyles.body.fontFamily,
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
} as const
