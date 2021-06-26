import { action } from '@storybook/addon-actions'
import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { CardSpecBaseType } from 'src/apollo/types/globalTypes'
import Box from 'src/components/Box'
import {
  cardBuilderReducer,
  initialStateOptions,
} from 'src/pages/CardBuilder/card-builder-state'
import CustomBuildStep from 'src/pages/CardBuilder/CustomBuildStep'

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
      ...initialStateOptions[CardSpecBaseType.Template],
      cardVersionId: 'cardv_1234',
      baseType: CardSpecBaseType.Custom,
      templateId: 'velia',
      quantity: 100,
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
