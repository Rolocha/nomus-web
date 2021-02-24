import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import { colors } from 'src/styles'
import Icon from './Icon'

type DangerButtonProps = {
  onClick?: (event: React.SyntheticEvent<any>) => void
}

const CancelButton = ({ onClick }: DangerButtonProps) => (
  <Button onClick={onClick} variant="dangerSecondary">
    <Box display="flex" flexDirection="row" alignItems="center">
      <Icon of="close" width="20px" color={colors.invalidRed} />
    </Box>
  </Button>
)

export default CancelButton
