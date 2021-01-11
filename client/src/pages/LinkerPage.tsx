import * as React from 'react'
import * as Text from 'src/components/Text'
import * as Form from 'src/components/Form'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from 'src/apollo'
import { LinkSheetToUserQuery } from 'src/apollo/types/LinkSheetToUserQuery'
import { yupResolver } from '@hookform/resolvers/yup'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import Button from 'src/components/Button'
import Link from 'src/components/Link'
import { createMailtoURL } from 'src/utils/email'

const bp = 'md'

interface LinkerFormData {
  shortId: string
}

const LINKER_MUTATION = gql`
  mutation LinkSheetToUserQuery($routeStr: String!, $shortId: String!) {
    linkSheetToUser(routeStr: $routeStr, shortId: $shortId) {
      userId
      sheetId
      error
    }
  }
`

const sendHelpEmail = (routeStr: string, errorStr: string | null): string => {
  return createMailtoURL({
    to: 'help@nomus.me',
    subject: `Sheet Linking Failed: ${routeStr}`,
    body: `
Sheet Linking Failed for sheet: ${routeStr}
Error String: ${errorStr}

ShortId on Sheet Edge: 
`.trim(),
  })
}

const LinkerPage = () => {
  const { register, handleSubmit, formState, setError, errors } = useForm<
    LinkerFormData
  >({
    resolver: yupResolver(
      yup.object().shape({
        shortId: yup.string().required('short-Id is required'),
      }),
    ),
  })
  const [linkSheet] = useMutation<LinkSheetToUserQuery>(LINKER_MUTATION)
  const [infoToEmail, setInfoToEmail] = React.useState<string | null>(null)

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
        if (response.errors) {
          setInfoToEmail(response.errors.toString())
          setError('shortId', {
            type: 'manual',
            message: 'Uh oh, something went wrong',
          })
        }
        if (response.data?.linkSheetToUser.error) {
          setInfoToEmail(response.data?.linkSheetToUser.error.toString())
          setError('shortId', {
            type: 'manual',
            message: response.data?.linkSheetToUser.error.toString(),
          })
        } else {
          setInfoToEmail(response.data?.linkSheetToUser.userId || '')
        }
      } catch (e) {
        setInfoToEmail(e.message)
        setError('shortId', {
          type: 'manual',
          message: 'Uh oh, something went wrong',
        })
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
            {!formState.isSubmitSuccessful && (
              <Text.PageHeader>Sheet Linker</Text.PageHeader>
            )}
            {formState.isSubmitSuccessful && (
              <Text.PageHeader color="validGreen">
                Success Linking Sheet!
              </Text.PageHeader>
            )}
          </Box>

          <Box gridArea="explain">
            {!formState.isSubmitSuccessful && (
              <Box>
                <Text.Body>This page is to link cards to a User.</Text.Body>
                <Text.Body>
                  For any questions, email help@nomus.me and we'll get it
                  sorted!
                </Text.Body>
              </Box>
            )}
            {formState.isSubmitSuccessful && (
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
            {!formState.isSubmitSuccessful && (
              <Text.Body>
                Please enter the 6 digit alphanumeric ID found on the long edge
                of the printed sheet below:
              </Text.Body>
            )}
          </Box>
          <Box gridArea="inputForm">
            {!formState.isSubmitSuccessful && (
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
            {!formState.isSubmitSuccessful && (
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
            {errors.shortId && (
              <Box>
                <Text.Body color="invalidRed">
                  Uh oh, That code doesn't seem to be right. Try typing it
                  again, or email us at{' '}
                  <Link
                    to={sendHelpEmail(window.location.pathname, infoToEmail)}
                  >
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
