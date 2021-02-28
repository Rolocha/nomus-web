// .storybook/preview.js
import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'

export const decorators = [
  (Story) => (
    <ChakraProvider>
      <Story />
    </ChakraProvider>
  ),
]
