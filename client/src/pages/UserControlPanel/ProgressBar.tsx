import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'

type ProgressBarProps = {
  value: number
  max: number
  showPercent: boolean
}

const ProgressBar = ({ value, max, showPercent }: ProgressBarProps) => (
  <Box display="flex" flexDirection="row" alignItems="center">
    <progress value={value} max={max} />
    {showPercent && (
      <Text.Plain fontSize="14px">{(value / max) * 100}%</Text.Plain>
    )}
  </Box>
)

ProgressBar.defaultProps = {
  max: 100,
  showPercent: false,
}

export default ProgressBar
