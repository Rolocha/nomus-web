import * as React from 'react'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import * as Text from 'src/components/Text'

const bp = 'md'

const Linker = () => {
  return (
    <Box>
      <Navbar />
      <Box
        container
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="flex-start"
        bg="white"
        position="relative"
      >
        <Box
          display="grid"
          gridTemplateAreas={{
            _: `
              "heading"
              "explain"
              "instructions"
              "inputForm"
              "send"
            `,
            [bp]: `
              "heading"
              "explain"
              "instructions"
              "inputForm"
              "send"
            `,
          }}
          gridColumnGap={3}
          gridRowGap={3}
        >
          <Box gridArea="heading" placeSelf="center">
            <Text.PageHeader>Sheet Linker</Text.PageHeader>
          </Box>

          <Box gridArea="explain">
            <Text.Body>This page is to link cards to a User.</Text.Body>
            <Text.Body>
              For any questions, email help@nomus.me and we'll get it sorted!
            </Text.Body>
          </Box>
          <Box gridArea="instructions">
            <Text.Body>
              Please enter the 6 digit alphanumeric ID found on the long edge of
              the printed sheet below
            </Text.Body>
          </Box>
          <Box gridArea="inputForm">Hi</Box>
          <Box gridArea="send">Button</Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Linker
