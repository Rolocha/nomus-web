import * as React from 'react'
import Box from 'src/components/Box'
// import { css } from '@emotion/core'
import colors from 'src/styles/colors'
import * as Text from 'src/components/Text'

type ProgressBarProps = {
  value: number
  max: number
  showPercent: boolean
  bgColor: string
  sliderColor: string
}

const ProgressBar = ({
  value,
  max,
  showPercent,
  bgColor,
  sliderColor,
}: ProgressBarProps) => (
  <Box display="flex" flexDirection="row" alignItems="center">
    <Box height={15} width={'100%'} backgroundColor={bgColor} borderRadius={50}>
      <Box
        height="100%"
        width={`${(value / max) * 100}%`}
        backgroundColor={sliderColor}
        transition="width 1s ease-in-out"
        borderRadius="inherit"
      ></Box>
    </Box>
    {showPercent && (
      <Text.Body3 fontSize="14px" ml={1}>
        {(value / max) * 100}%
      </Text.Body3>
    )}
  </Box>
)

ProgressBar.defaultProps = {
  max: 100,
  showPercent: false,
  bgColor: '#e0e0de',
  sliderColor: colors.nomusBlue,
}

export default ProgressBar
