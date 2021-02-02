import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import { css } from '@emotion/react'
import { colors } from 'src/styles'

type SaveButtonProps = {
  onClick?: (event: React.SyntheticEvent<any>) => void
  iconOnlyBp?: string | null
}

const SaveButton = ({ iconOnlyBp, onClick }: SaveButtonProps) => (
  <Button onClick={onClick} variant="success">
    <Box display="flex" flexDirection="row" alignItems="center">
      <SVG.Check
        css={css`
          width: 20px;
          ${iconOnlyBp}
        `}
        color={colors.validGreen}
      />
      <Box
        display={iconOnlyBp ? { _: 'none', [iconOnlyBp]: 'block' } : 'block'}
      >
        <Text.Body2 fontSize="14px" color="validGreen" mr={1}>
          Save
        </Text.Body2>
      </Box>
    </Box>
  </Button>
)

export default SaveButton
