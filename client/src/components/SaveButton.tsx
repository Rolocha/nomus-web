import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import { css } from '@emotion/react'
import { colors } from 'src/styles'

type SaveButtonProps = {
  onClick?: (event: React.SyntheticEvent<any>) => void
}

const SaveButton = ({ onClick }: SaveButtonProps) => (
  <Button onClick={onClick} variant="success" px="24px">
    <Box display="flex" flexDirection="row" alignItems="center">
      <SVG.Check
        css={css`
          width: 20px;
        `}
        color={colors.validGreen}
      />
    </Box>
  </Button>
)

export default SaveButton
