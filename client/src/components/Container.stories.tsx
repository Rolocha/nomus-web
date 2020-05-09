import React from 'react'

import Container from 'src/components/Container'
import { Body } from 'src/components/Text'

export default {
  title: 'Container',
  component: Container,
  excludeStories: /.*Data$/,
}

export const DefaultContainer = () => (
  <Container bg="#333">
    <Container borderWidth="2px" borderStyle="solid" borderColor="bgBeige">
      <Body color="bgBeige">A default container</Body>
    </Container>
  </Container>
)
export const FullContainer = () => (
  <Container variant="full" bg="#333">
    <Container borderWidth="2px" borderStyle="solid" borderColor="bgBeige">
      <Body color="bgBeige">A full container</Body>
    </Container>
  </Container>
)

export const FullVerticalContainer = () => (
  <Container variant="fullVertical" bg="#333">
    <Container borderWidth="2px" borderStyle="solid" borderColor="bgBeige">
      <Body color="bgBeige">A full vertical container</Body>
    </Container>
  </Container>
)

export const SmallContainer = () => (
  <Container variant="small" bg="#333">
    <Container borderWidth="2px" borderStyle="solid" borderColor="bgBeige">
      <Body color="bgBeige">A small container</Body>
    </Container>
  </Container>
)
