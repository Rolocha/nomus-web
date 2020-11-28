import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'

const bp = 'md'

interface Props {
  userId: string
  routeStr: string
}

const LinkSuccess = (props: Props) => {
  return (
    <Box>
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
            `,
            [bp]: `
              "heading"
              "explain"
              "instructions"
            `,
          }}
          gridColumnGap={3}
          gridRowGap={3}
        >
          <Box gridArea="heading" placeSelf="center" color="invalidRed">
            <Text.PageHeader color="validGreen">
              Success Linking Sheet!
            </Text.PageHeader>
          </Box>
          <Box gridArea="explain">
            <Text.Body>That went well!</Text.Body>
            <Text.Body>Thank you for all the work you do :)</Text.Body>
          </Box>
          <Box gridArea="instructions">
            <Text.Body>
              Successfully linked routeStr: {props.routeStr}
            </Text.Body>
            <Text.Body>To userId: {props.userId}</Text.Body>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LinkSuccess
