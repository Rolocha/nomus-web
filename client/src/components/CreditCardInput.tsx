import { ClassNames } from '@emotion/core'

import * as React from 'react'
import * as stripeJs from '@stripe/stripe-js'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Box from './Box'
import { colors, typography } from 'src/styles'

interface Props {
  id?: string
  postalCode?: string
  handleChange: (event: stripeJs.StripeCardElementChangeEvent) => void
}

const CreditCardInput = ({ handleChange, id, postalCode }: Props) => {
  return (
    <Box>
      <ClassNames>
        {({ css, cx }) => (
          <CardElement
            id={id}
            options={{
              classes: {
                base: css({
                  padding: 10,
                  borderRadius: '6px',
                  border: `1px solid ${colors.africanElephant}`,
                }),
                invalid: css({
                  color: colors.invalidRed,
                  iconColor: '#fa755a',
                }),
              },
              style: {
                base: {
                  fontFamily: typography.fontFamilies.rubik,
                  fontSize: '16px',
                  color: colors.midnightGray,
                  fontSmoothing: 'antialiased',
                  '::placeholder': {
                    fontSize: '16px',
                    fontFamily: typography.fontFamilies.rubik,
                    color: colors.africanElephant,
                  },
                },
              },
              value: {
                postalCode: postalCode || undefined,
              },
            }}
            onChange={handleChange}
          />
        )}
      </ClassNames>
    </Box>
  )
}

export default CreditCardInput
