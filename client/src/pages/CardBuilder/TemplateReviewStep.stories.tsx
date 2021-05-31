import { action } from '@storybook/addon-actions'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Box from 'src/components/Box'
import { cardBuilderReducer } from 'src/pages/CardBuilder/card-builder-state'
import TemplateReviewStep from 'src/pages/CardBuilder/TemplateReviewStep'
import { sampleCardBuilderState } from 'src/pages/CardBuilder/util'

export default {
  title: 'components/CardBuilder/Template/ReviewStep',
  component: TemplateReviewStep,
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

  return (
    <Box maxWidth="1200px" border="1px solid #eee" p={4}>
      <TemplateReviewStep
        cardBuilderState={cardBuilderState}
        updateCardBuilderState={updateCardBuilderState}
      />
    </Box>
  )
}
