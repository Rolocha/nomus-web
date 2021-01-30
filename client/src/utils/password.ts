import { colors } from 'src/styles'
import zxcvbn, { ZXCVBNScore } from 'zxcvbn'

const MINIMUM_PASSWORD_STRENGTH = 2

interface PasswordScore {
  score: ZXCVBNScore
  label: string
  color: string
  sufficientlySecure: boolean
}

export const getScoreMetadata = (
  score: ZXCVBNScore,
): { label: string; color: string } => {
  switch (score) {
    case 0:
      return { label: 'Very weak', color: colors.superlightGray }
    case 1:
      return { label: 'Weak', color: colors.invalidRed }
    case 2:
      return { label: 'So-so', color: colors.poppy }
    case 3:
      return { label: 'Good', color: colors.validGreen }
    case 4:
      return { label: 'Great!', color: colors.validGreen }
  }
}

export const getPasswordScore = (
  password: string,
  // Pass strings such as the user's name, email, etc. to prevent users from using those in the password
  extraInputs: Array<string> = [],
): PasswordScore => {
  const score = zxcvbn(password, [
    'nomus',
    'businesscard',
    'nfc',
    ...extraInputs,
  ]).score
  return {
    score,
    ...getScoreMetadata(score),
    sufficientlySecure: !(score < MINIMUM_PASSWORD_STRENGTH),
  }
}

export const validatePassword = (value: string | null | undefined) =>
  value ? getPasswordScore(value).sufficientlySecure : false
