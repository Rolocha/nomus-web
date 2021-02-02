import { css } from '@emotion/react'
import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'

type EditButtonProps = {
  onClick?: (event: React.SyntheticEvent<any>) => void
  variant?: 'primary' | 'tertiary'
  iconOnlyBp?: string | null
  text?: string
}
const EditButton = ({
  iconOnlyBp = null,
  variant = 'tertiary',
  onClick,
  text = 'Edit',
}: EditButtonProps) => {
  const textColor = { primary: colors.white, tertiary: colors.nomusBlue }[
    variant
  ]
  return (
    <Button onClick={onClick} variant={variant} px="24px">
      <Box display="flex" flexDirection="row" alignItems="center">
        <SVG.Pen
          color={textColor}
          css={css`
            width: 20px;
          `}
        />
        <Box
          display={iconOnlyBp ? { _: 'none', [iconOnlyBp]: 'block' } : 'block'}
          ml="8px"
        >
          <Text.Body2 fontSize="14px" color={textColor}>
            {text}
          </Text.Body2>
        </Box>
      </Box>
    </Button>
  )
}

export default EditButton
