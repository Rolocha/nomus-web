import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as SVG from 'src/components/SVG'
import { css } from '@emotion/react'
import { colors } from 'src/styles'

type DangerButtonProps = {
  onClick?: (event: React.SyntheticEvent<any>) => void
}

const DangerButton = ({ onClick }: DangerButtonProps) => (
  <Button onClick={onClick} variant="dangerSecondary">
    <Box display="flex" flexDirection="row" alignItems="center">
      <SVG.Close
        css={css`
          width: 20px;
        `}
        color={colors.invalidRed}
      />
    </Box>
  </Button>
)

export default DangerButton
