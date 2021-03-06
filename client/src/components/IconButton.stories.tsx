// Button.stories.tsx

import React from 'react'

import { Story } from '@storybook/react'
import IconButton from 'src/components/IconButton'
import iconButtonStyles from 'src/styles/components/icon-button'
import Icon, { iconNames } from './Icon'

export default {
  title: 'components/IconButton',
  component: IconButton,
  argTypes: {
    icon: {
      control: {
        type: 'select',
        options: iconNames,
      },
    },
    variant: {
      control: {
        type: 'select',
        options: Object.keys(iconButtonStyles.variants),
      },
    },
  },
}
//👇 We create a “template” of how args map to rendering
const Template: Story<React.ComponentProps<typeof IconButton>> = ({
  icon,
  ...args
}) => <IconButton icon={<Icon of={icon} />} {...args} />

export const Primary = Template.bind({})

Primary.args = {
  variant: 'primary',
  icon: 'profile',
}
