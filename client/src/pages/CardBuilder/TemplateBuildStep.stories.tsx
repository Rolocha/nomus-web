import { action } from '@storybook/addon-actions'
import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Box from 'src/components/Box'
import { cardBuilderReducer } from 'src/pages/CardBuilder/card-builder-state'
import TemplateBuildStep from 'src/pages/CardBuilder/TemplateBuildStep'
import { sampleCardBuilderState } from 'src/pages/CardBuilder/util'

export default {
  title: 'components/CardBuilder/Template/BuildStep',
  component: TemplateBuildStep,
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
      <TemplateBuildStep
        cardBuilderState={cardBuilderState}
        updateCardBuilderState={updateCardBuilderState}
      />
    </Box>
  )
}
