// .storybook/preview.js
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../src/styles/theme'
import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(
  'pk_test_51IdRQ2GTbyReVwroG0zSDehnVl2mFiST5kAU8wVfwnDdEtHorY5xiEeoLLfbLpUkKaRdllLCKVqXEGcIcKNDQ1VP008nRLt8Lp',
)

export const decorators = [
  (Story) => (
    <Elements
      stripe={stripePromise}
      options={{
        fonts: [
          {
            cssSrc:
              'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap',
          },
        ],
      }}
    >
      <ChakraProvider theme={theme}>
        <Story />
      </ChakraProvider>
    </Elements>
  ),
]
