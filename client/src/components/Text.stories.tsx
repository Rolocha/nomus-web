import React from 'react'
import Box from 'src/components/Box'

import * as Text from 'src/components/Text'

export default {
  title: 'Text',
  component: Text,
}

export const Typography = () => (
  <Box>
    <Text.Heading>Heading</Text.Heading>
    <Text.PageHeader>Page Header</Text.PageHeader>
    <Text.SectionHeader>Section Header</Text.SectionHeader>
    <Text.SectionSubheader>Section Subheader</Text.SectionSubheader>
    <Text.Body>Body</Text.Body>
    <Text.Caption>Caption</Text.Caption>
  </Box>
)
