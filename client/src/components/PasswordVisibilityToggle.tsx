import * as React from 'react'
import Box from './Box'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import Icon from './Icon'

interface Props {
  visible: boolean
  setVisible: (newVisible: boolean) => void
}

const PasswordVisibilityToggle = ({ visible, setVisible }: Props) => {
  return (
    <Box
      role="button"
      cursor="pointer"
      display="flex"
      alignItems="center"
      onClick={() => setVisible(!visible)}
    >
      <Icon of="eye" color={colors.nomusBlue} />
      <Text.Body3 color="nomusBlue" ml={1} fontWeight={500}>
        {visible ? 'Hide' : 'Show'} password
      </Text.Body3>
    </Box>
  )
}

export default PasswordVisibilityToggle
