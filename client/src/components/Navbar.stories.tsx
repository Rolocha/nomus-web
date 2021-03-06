import { action } from '@storybook/addon-actions'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'

export default {
  title: 'components/Navbar',
  component: Navbar,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

export const Primary = () => {
  return (
    <Router>
      <Box>
        <Navbar />
      </Box>
    </Router>
  )
}
