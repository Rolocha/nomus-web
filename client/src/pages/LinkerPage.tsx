import * as React from 'react'
import * as Text from 'src/components/Text'
import * as Form from 'src/components/Form'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from 'src/apollo'
import { LinkSheetToUserQuery } from 'src/apollo/types/LinkSheetToUserQuery'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import Button from 'src/components/Button'
import Link from 'src/components/Link'

const bp = 'md'

interface LinkerFormData {
  shortId: string
}

const LINKER_MUTATION = gql`
  mutation LinkSheetToUserQuery($routeStr: String!, $shortId: String!) {
    linkSheetToUser(routeStr: $routeStr, shortId: $shortId) {
      userId
      sheetId
    }
  }
`

const sendHelpEmail = (routeStr: string, errorStr: string): string => {
  const params = new URLSearchParams()
  params.set('subject', 'Sheet Linking Failed: ' + routeStr)
  params.set(
    'body',
    `Sheet Linking Failed for sheet: ${routeStr} \nError String: ${errorStr} \nShortId on Sheet Edge: `,
  )
  return `mailto:help@nomus.me?${params.toString()}`
}

const LinkerPage = () => {
  const { register, handleSubmit } = useForm<LinkerFormData>()
  const [linkSheet] = useMutation<LinkSheetToUserQuery>(LINKER_MUTATION)
  const [submissionState, setSubmissionState] = React.useState<null | boolean>(
    null,
  )
  const [extraInfo, setExtraInfo] = React.useState('No Info')

  const onSubmitLinker = async (formData: LinkerFormData) => {
    if (formData.shortId) {
      const currUrl = window.location.pathname.split('/')
      const routeStr = currUrl[currUrl.length - 1]
      try {
        const response = await linkSheet({
          variables: {
            routeStr: routeStr,
            shortId: formData.shortId.toUpperCase(),
          },
        })
        console.log(response)
        if (response.errors) {
          setExtraInfo(response.errors.toString())
          setSubmissionState(false)
        } else {
          setExtraInfo(response.data?.linkSheetToUser.userId || '')
          setSubmissionState(true)
        }
      } catch (e) {
        setExtraInfo(e.message)
        setSubmissionState(false)
      }
    }
  }

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
              "buttonSection"
            `,
            [bp]: `
              "heading"
              "explain"
              "instructions"
              "inputForm"
              "buttonSection"
            `,
          }}
          gridColumnGap={3}
          gridRowGap={3}
        >
          <Box gridArea="heading" placeSelf="center">
            {!submissionState && (
              <Text.PageHeader>Sheet Linker</Text.PageHeader>
            )}
            {submissionState === true && (
              <Text.PageHeader color="validGreen">
                Success Linking Sheet!
              </Text.PageHeader>
            )}
          </Box>

          <Box gridArea="explain">
            {!submissionState && (
              <Box>
                <Text.Body>This page is to link cards to a User.</Text.Body>
                <Text.Body>
                  For any questions, email help@nomus.me and we'll get it
                  sorted!
                </Text.Body>
              </Box>
            )}
            {submissionState === true && (
              <Box>
                <Text.Body>That went well!</Text.Body>
                <Text.Body>
                  Thank you for all the work you do{' '}
                  <span role="img" aria-label="smiley">
                    😊
                  </span>
                </Text.Body>
              </Box>
            )}
          </Box>
          <Box gridArea="instructions">
            {!submissionState && (
              <Text.Body>
                Please enter the 6 digit alphanumeric ID found on the long edge
                of the printed sheet below:
              </Text.Body>
            )}
          </Box>
          <Box gridArea="inputForm">
            {!submissionState && (
              <Box>
                <Text.Label>Short ID:</Text.Label>
                <Form.Form>
                  <Form.Input
                    onSubmit={handleSubmit(onSubmitLinker)}
                    ref={register()}
                    name="shortId"
                    type="string"
                    fontSize="16px"
                    width="100%"
                  />
                </Form.Form>
              </Box>
            )}
          </Box>
          <Box gridArea="buttonSection">
            {!submissionState && (
              <Button
                onClick={handleSubmit(onSubmitLinker)}
                variant="secondary"
                width={{ _: '100%', [bp]: '100%' }}
                mb={3}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Text.Body2 fontSize="14px" color="nomusBlue">
                    Link
                  </Text.Body2>
                </Box>
              </Button>
            )}
            {submissionState === false && (
              <Box>
                <Text.Body color="invalidRed">
                  Uh oh, that code doesn't seem to be right. Try typing it
                  again, or email us at{' '}
                  <Link to={sendHelpEmail(window.location.pathname, extraInfo)}>
                    help@nomus.me
                  </Link>{' '}
                  and we'll help sort it out.
                </Text.Body>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LinkerPage
