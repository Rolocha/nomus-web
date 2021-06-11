import { Story } from '@storybook/react'
import React from 'react'
import Box from 'src/components/Box'
import Label from 'src/components/Form/Label'
import PhoneNumberInput from 'src/components/Form/PhoneNumberInput'

export default {
  title: 'components/Form/PhoneNumberInput',
  component: PhoneNumberInput,
  excludeStories: /.*Data$/,
}

const PrimaryTemplate: Story<
  React.ComponentProps<typeof PhoneNumberInput>
> = () => {
  const [phoneNumber, setPhoneNumber] = React.useState('+14088168')
  return (
    <Box width="400px">
      <Label>Phone number</Label>
      <PhoneNumberInput value={phoneNumber} onChange={setPhoneNumber} />
    </Box>
  )
}

export const Primary = PrimaryTemplate.bind({})

Primary.args = {}
