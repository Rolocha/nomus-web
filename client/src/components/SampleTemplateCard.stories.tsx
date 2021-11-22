import React from 'react'
import Box from 'src/components/Box'
import SampleTemplateCard from 'src/components/SampleTemplateCard'
import { templateNames } from 'src/templates'

export default {
  title: 'components/SampleTemplateCard',
  component: SampleTemplateCard,
  excludeStories: /.*Data$/,
}

export const Primary = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="400px 400px 400px"
      gridColumnGap="16px"
    >
      {templateNames.map((templateName) => (
        <SampleTemplateCard templateId={templateName} />
      ))}
    </Box>
  )
}
