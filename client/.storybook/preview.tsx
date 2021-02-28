// .storybook/preview.js
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../src/styles/theme'
import React from 'react'

export const decorators = [
  (Story) => (
    <ChakraProvider theme={theme}>
      <Story />
    </ChakraProvider>
  ),
]
