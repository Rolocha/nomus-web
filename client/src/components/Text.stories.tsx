import React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'

export default {
  title: 'Text',
  component: Text,
}

export const Typography = () => (
  <Box>
    <Text.BrandHeader>BrandHeader</Text.BrandHeader>
    <Text.PageHeader>Page Header</Text.PageHeader>
    <Text.SectionHeader>Section Header</Text.SectionHeader>
    <Text.CardHeader>Card Header</Text.CardHeader>
    <Text.SectionSubheader>Section Subheader</Text.SectionSubheader>
    <Text.MainNav>Main Nav Header</Text.MainNav>

    <Text.Body>Body</Text.Body>
    <Text.Body2>Body2</Text.Body2>
    <Text.Body3>Body3</Text.Body3>

    <Text.Label>Label</Text.Label>
  </Box>
)
