import { css } from '@emotion/core'
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
  <Button onClick={onClick} variant="plainButLightOnHover">
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
        <Text.Plain fontSize="14px" fontWeight="bold" color="primaryTeal">
          Edit
        </Text.Plain>
      </Box>
    </Box>
  </Button>
)

EditButton.defaultProps = {
  iconOnlyBp: null,
}

export default EditButton
