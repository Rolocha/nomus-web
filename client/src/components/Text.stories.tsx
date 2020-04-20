import React from 'react'

import * as Text from 'components/Text'

export default {
  title: 'Text',
  component: Text,
}

export const Heading = () => <Text.Heading>This is a heading.</Text.Heading>
export const Body = () => <Text.Body>This is body text.</Text.Body>
export const Caption = () => <Text.Caption>This is caption text.</Text.Caption>
