import { BrowserRouter as Router } from 'react-router-dom'
import { action } from '@storybook/addon-actions'
import React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import Link from 'src/components/Link'
import { createMailtoURL } from 'src/utils/email'

export default {
  title: 'components/Link',
  component: Link,
  excludeStories: /.*Data$/,
  decorators: [
    (Story: any) => (
      <Router>
        <Story />
      </Router>
    ),
  ],
}

export const actionsData = {
  onClick: action('clicked'),
}

export const ExternalLink = () => {
  return (
    <Box>
      <Link to="https://google.com">Google</Link>
    </Box>
  )
}

export const InternalLink = () => {
  return (
    <Box>
      <Link to="/dashboard">Dashboard</Link>
    </Box>
  )
}

export const MailToLink = () => {
  return (
    <Box>
      <Link
        to={createMailtoURL({
          to: 'hi@nomus.me',
        })}
      >
        Contact us
      </Link>
    </Box>
  )
}

export const LinksThatLookLikeButtons = () => {
  return (
    <Box>
      <Text.Body2>Some links that takes on button styles</Text.Body2>
      <Box display="grid" gridTemplateColumns="1fr 1fr" width="600px">
        <Link to="https://google.com" buttonSize="big" buttonStyle="secondary">
          Google
        </Link>
        <Link
          to="https://facebook.com"
          buttonSize="normal"
          buttonStyle="primary"
        >
          Facebook
        </Link>
      </Box>
    </Box>
  )
}
