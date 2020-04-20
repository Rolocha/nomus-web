import React from 'react'
import { action } from '@storybook/addon-actions'

import Button from 'components/Button'

export default {
  title: 'Button',
  component: Button,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

export const Primary = () => (
  <Button variant="primary" {...actionsData}>
    Primary Button!
  </Button>
)

export const Secondary = () => (
  <Button variant="secondary" {...actionsData}>
    Secondary Button!
  </Button>
)

export const SecondaryLight = () => (
  <Button variant="secondaryLight" {...actionsData}>
    Secondary Light Button!
  </Button>
)
