import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import { css } from '@emotion/react'
import { colors } from 'src/styles'
import Icon from './Icon'

type SaveButtonProps = {
  onClick?: (event: React.SyntheticEvent<any>) => void
}

const SaveButton = ({ onClick }: SaveButtonProps) => (
  <Button onClick={onClick} variant="success">
    <Box display="flex" flexDirection="row" alignItems="center">
      <Icon
        of="check"
        css={css`
          width: 20px;
        `}
        color={colors.validGreen}
      />
    </Box>
  </Button>
)

export default SaveButton
