import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import Link from 'src/components/Link'
import { css } from '@emotion/core'

const bp = 'md'

interface Props {
  routeStr: string
  errorStr: string
}

const sendHelpEmail = (routeStr: string, errorStr: string): string => {
  const params = new URLSearchParams()
  params.set('subject', 'Sheet Linking Failed: ' + routeStr)
  params.set(
    'body',
    'Sheet Linking Failed for sheet: ' +
      routeStr +
      '\nError String: `' +
      errorStr +
      '`\nShort Id on Sheet Edge:',
  )
  return `mailto:help@nomus.me?${params.toString()}`
}

const LinkFail = (props: Props) => {
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
              "emailButton"
            `,
            [bp]: `
              "heading"
              "explain"
              "instructions"
              "emailButton"
            `,
          }}
          gridColumnGap={3}
          gridRowGap={3}
        >
          <Box gridArea="heading" placeSelf="center" color="invalidRed">
            <Text.PageHeader color="invalidRed">
              Error Linking Sheet!
            </Text.PageHeader>
          </Box>
          <Box gridArea="explain">
            <Text.Body>Something went wrong linking this sheet!</Text.Body>
            <Text.Body>
              We'll get it sorted, click the button below and it'll email
              help@nomus.me with the information we need.
            </Text.Body>
            <Text.Body>
              If this was a mistake, rescan the same card and retype the Short
              Id.
            </Text.Body>
          </Box>
          <Box gridArea="instructions">
            <Text.Body>
              Please enter the 6 digit alphanumeric ID found on the long edge of
              the printed sheet in the email.
            </Text.Body>
          </Box>
          <Box
            gridArea="emailButton"
            display="flex"
            flexDirection="row"
            justifyContent="stretch"
            mt={3}
            mx={-1}
            css={css`
              & > * {
                flex-grow: 1;
                > * {
                  width: 100%;
                }
              }
            `}
          >
            <Box px={1} display="flex" justifyContent="stretch">
              <Link
                asButton
                buttonStyle="primary"
                to={sendHelpEmail(props.routeStr, props.errorStr)}
              >
                Contact Nomus
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LinkFail
