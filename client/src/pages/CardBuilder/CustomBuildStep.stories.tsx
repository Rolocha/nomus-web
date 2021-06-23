import { action } from '@storybook/addon-actions'
import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Box from 'src/components/Box'
import {
  cardBuilderReducer,
  initialStateOptions,
} from 'src/pages/CardBuilder/card-builder-state'
import CustomBuildStep from 'src/pages/CardBuilder/CustomBuildStep'
import { BaseType } from 'src/pages/CardBuilder/types'

export default {
  title: 'components/CardBuilder/Custom/BuildStep',
  component: CustomBuildStep,
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
    {
      ...initialStateOptions[BaseType.Template],
      cardVersionId: 'cardv_1234',
      baseType: BaseType.Custom,
      templateId: 'velia',
      quantity: 100,
      formData: {
        name: 'Spongebob',
        addressLine1: '123 Pineapple St',
        city: 'Bikini Bottom',
        state: 'UW',
        postalCode: '12345',
      },
    },
  )

  return (
    <Box maxWidth="1200px" border="1px solid #eee" p={4}>
      <CustomBuildStep
        cardBuilderState={cardBuilderState}
        updateCardBuilderState={updateCardBuilderState}
      />
    </Box>
  )
}
