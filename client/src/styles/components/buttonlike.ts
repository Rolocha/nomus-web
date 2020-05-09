import theme from '../theme'

// Defining button styles centrally here since both <a /> and <button /> will consume them

export const styleVariants = {
  primary: {
    backgroundColor: theme.colors.validGreen,
    borderColor: theme.colors.validGreen,
    color: theme.colors.bgBeige,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.validGreen,
    color: theme.colors.validGreen,
  },
  secondaryLight: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.bgBeige,
    color: theme.colors.bgBeige,
  },
  blue: {
    backgroundColor: theme.colors.primaryTeal,
    borderColor: theme.colors.primaryTeal,
    color: theme.colors.bgBeige,
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
  fontFamily: theme.textStyles.body.fontFamily,
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
} as const
