import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import { mq } from 'src/styles/breakpoints'
import { css } from '@emotion/core'
import { colors } from 'src/styles'

type SaveButtonProps = {
  onClick?: (event: React.SyntheticEvent<any>) => void
  iconOnlyBp?: string | null
}

const SaveButton = ({ iconOnlyBp, onClick }: SaveButtonProps) => (
  <Button onClick={onClick} variant="success">
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box
        display={iconOnlyBp ? { _: 'none', [iconOnlyBp]: 'block' } : 'block'}
      >
        <Text.Body2 fontSize="14px" color="validGreen">
          Save
        </Text.Body2>
      </Box>
      <SVG.Check
        css={css`
          width: 20px;
          ${iconOnlyBp &&
          `${mq[iconOnlyBp]} {
            margin-right: 8px;
        }`}
        `}
        color={colors.validGreen}
      />
    </Box>
  </Button>
)

export default SaveButton
