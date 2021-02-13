import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import { css } from '@emotion/react'
import { colors } from 'src/styles'

type DangerButtonProps = {
  onClick?: (event: React.SyntheticEvent<any>) => void
  iconOnlyBp?: string | null
}

const DangerButton = ({ iconOnlyBp, onClick }: DangerButtonProps) => (
  <Button onClick={onClick} variant="dangerSecondary" px="24px">
    <Box display="flex" flexDirection="row" alignItems="center">
      <SVG.Close
        css={css`
          width: 15px;
          ${iconOnlyBp}
        `}
        color={colors.invalidRed}
      />
      <Box
        display={iconOnlyBp ? { _: 'none', [iconOnlyBp]: 'block' } : 'block'}
      >
        <Text.Body2 fontSize="14px" color="invalidRed" mr={1}>
          Cancel
        </Text.Body2>
      </Box>
    </Box>
  </Button>
)

export default DangerButton
