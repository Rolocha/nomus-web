import { css } from '@emotion/core'
import { BrowserRouter as Router } from 'react-router-dom'
import { action } from '@storybook/addon-actions'
import React from 'react'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import * as Text from 'src/components/Text'

export default {
  title: 'Navbar',
  component: Navbar,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

export const Primary = () => {
  return (
    <Router>
      <Box borderBottom="1px solid black">
        <Navbar />
      </Box>
    </Router>
  )
}
