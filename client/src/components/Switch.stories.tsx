import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import * as React from 'react'
import { Switch } from '@chakra-ui/react'

export default {
  title: 'components/Switch',
  component: Switch,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

//👇 We create a “template” of how args map to rendering
const PrimaryTemplate: Story<React.ComponentProps<typeof Switch>> = ({
  ...args
}) => {
  const [checked, setChecked] = React.useState(false)
  return (
    <Switch
      {...args}
      isChecked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  )
}

export const Primary = PrimaryTemplate.bind({})

Primary.args = {
  colorScheme: 'blue',
}
