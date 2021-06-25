import { yupResolver } from '@hookform/resolvers/yup'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { useForm } from 'react-hook-form'
import { BrowserRouter as Router } from 'react-router-dom'
import Box from 'src/components/Box'
import { cardBuilderReducer } from 'src/pages/CardBuilder/card-builder-state'
import TemplateCheckoutStep from 'src/pages/CardBuilder/CheckoutStep'
import { CheckoutFormData } from 'src/pages/CardBuilder/types'
import { sampleCardBuilderState } from 'src/pages/CardBuilder/util'
import * as yup from 'yup'

export default {
  title: 'components/CardBuilder/Template/CheckoutStep',
  component: TemplateCheckoutStep,
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

export const Primary = () => {
  const [cardBuilderState, updateCardBuilderState] = React.useReducer(
    cardBuilderReducer,
    sampleCardBuilderState,
  )

  const checkoutFormMethods = useForm<CheckoutFormData>({
    defaultValues: cardBuilderState.checkoutFormData ?? undefined,
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        state: yup.string().required('Required'),
        //   .test('is-state', 'Invalid state', isValidStateAbr),
        postalCode: yup
          .string()
          .required('Required')
          .matches(/^\d{5}$/, 'Invalid ZIP code'),
      }),
    ),
  })

  return (
    <Box maxWidth="1200px" border="1px solid #eee" p={4}>
      <TemplateCheckoutStep
        cardBuilderState={cardBuilderState}
        updateCardBuilderState={updateCardBuilderState}
        checkoutFormMethods={checkoutFormMethods}
      />
    </Box>
  )
}
