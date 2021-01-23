import * as React from 'react'
import Box from 'src/components/Box'
import colors from 'src/styles/colors'
import * as Text from 'src/components/Text'

type Props = {
  value: number
  max?: number
  showPercent?: boolean
  bgColor?: string
  sliderColor?: string
}

const ProgressBar = ({
  value,
  max = 100,
  showPercent = false,
  bgColor = colors.lightGray,
  sliderColor = colors.nomusBlue,
}: Props) => (
  <Box display="flex" flexDirection="row" alignItems="center">
    <Box height={15} width="100%" bg={bgColor} borderRadius={50}>
      <Box
        height="100%"
        width={`${(value / max) * 100}%`}
        bg={sliderColor}
        transition="width 0.5s ease-in-out"
        borderRadius="inherit"
      />
    </Box>
    {showPercent && (
      <Text.Body3 fontSize="14px" ml={1}>
        {(value / max) * 100}%
      </Text.Body3>
    )}
  </Box>
)

export default ProgressBar
