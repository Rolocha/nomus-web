import { CircularProgress, CircularProgressProps } from '@chakra-ui/react'
import * as React from 'react'
import { colors } from 'src/styles'

interface Props extends CircularProgressProps {
  size?: string
}

const Spinner = (props: Props) => (
  <CircularProgress
    data-testid="spinner"
    isIndeterminate
    color={colors.nomusBlue}
    {...props}
  />
)

export default Spinner
