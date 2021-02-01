import { css } from '@emotion/react'
import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import { mq } from 'src/styles/breakpoints'

type EditButtonProps = {
  onClick?: (event: React.SyntheticEvent<any>) => void
  iconOnlyBp?: string | null
}
const EditButton = ({ iconOnlyBp, onClick }: EditButtonProps) => (
  <Button onClick={onClick} variant="tertiary">
    <Box display="flex" flexDirection="row" alignItems="center">
      <SVG.Pen
        css={css`
          width: 20px;
          ${iconOnlyBp &&
          `${mq[iconOnlyBp]} {
              margin-right: 8px;
          }`}
        `}
      />
      <Box
        display={iconOnlyBp ? { _: 'none', [iconOnlyBp]: 'block' } : 'block'}
      >
        <Text.Body2 fontSize="14px" color="nomusBlue">
          Edit
        </Text.Body2>
      </Box>
    </Box>
  </Button>
)

EditButton.defaultProps = {
  iconOnlyBp: null,
}

export default EditButton
