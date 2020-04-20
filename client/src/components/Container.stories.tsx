import React from 'react'

import Container from 'components/Container'
import { Body } from 'components/Text'

export default {
  title: 'Container',
  component: Container,
  excludeStories: /.*Data$/,
}

export const DefaultContainer = () => (
  <Container bg="#333">
    <Container borderWidth="2px" borderStyle="solid" borderColor="offWhite">
      <Body color="offWhite">A default container</Body>
    </Container>
  </Container>
)
export const FullContainer = () => (
  <Container variant="full" bg="#333">
    <Container borderWidth="2px" borderStyle="solid" borderColor="offWhite">
      <Body color="offWhite">A full container</Body>
    </Container>
  </Container>
)

export const FullVerticalContainer = () => (
  <Container variant="fullVertical" bg="#333">
    <Container borderWidth="2px" borderStyle="solid" borderColor="offWhite">
      <Body color="offWhite">A full vertical container</Body>
    </Container>
  </Container>
)

export const SmallContainer = () => (
  <Container variant="small" bg="#333">
    <Container borderWidth="2px" borderStyle="solid" borderColor="offWhite">
      <Body color="offWhite">A small container</Body>
    </Container>
  </Container>
)
