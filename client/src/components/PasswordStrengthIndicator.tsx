import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import { getPasswordScore } from 'src/utils/password'
import ProgressBar from './ProgressBar'

interface Props {
  password: string
}

const PasswordStrengthIndicator = ({ password }: Props) => {
  const currPasswordScore = getPasswordScore(password)
  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <Box width="100%" mt="4px">
        <ProgressBar
          value={currPasswordScore.score}
          sliderColor={currPasswordScore.color}
          max={4}
        />
      </Box>
      {password && (
        <Text.Body3 textAlign="right">{currPasswordScore.label}</Text.Body3>
      )}
    </Box>
  )
}

export default PasswordStrengthIndicator
