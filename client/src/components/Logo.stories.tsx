import React from 'react'

import Logo from 'src/components/Logo'

export default {
  title: 'Logo',
  component: Logo,
  excludeStories: /.*Data$/,
}

export const Primary = () => <Logo />
