import * as React from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from 'src/apollo'
import { LinkSheetToUserQuery } from 'src/apollo/types/LinkSheetToUserQuery'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Navbar from 'src/components/Navbar'
import SaveButton from 'src/components/SaveButton'
import * as Text from 'src/components/Text'
import LoadingPage from './LoadingPage'

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

const Linker = () => {
  const {
    register: linkerFormRegister,
    handleSubmit: linkerFormHandleSubmit,
  } = useForm<LinkerFormData>()
  const [linkSheet] = useMutation<LinkSheetToUserQuery>(LINKER_MUTATION)

  const onSubmitLinker = (formData: LinkerFormData) => {
    if (formData.shortId) {
      const currUrl = window.location.pathname.split('/')
      const routeStr = currUrl[currUrl.length - 1]
      console.log(routeStr)
      linkSheet({
        variables: {
          routeStr: routeStr,
          shortId: formData.shortId,
        },
      })
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
          <Box gridArea="inputForm">
            <Text.Label>Short ID:</Text.Label>
            <Form.Form>
              <Form.Input
                onSubmit={linkerFormHandleSubmit(onSubmitLinker)}
                ref={linkerFormRegister()}
                name="shortId"
                type="string"
                fontSize="16px"
              />
            </Form.Form>
          </Box>
          <Box gridArea="send">
            <Button
              onClick={linkerFormHandleSubmit(onSubmitLinker)}
              variant="secondary"
              width={{ _: '100%', [bp]: '50%' }}
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                <Text.Body2 fontSize="14px" color="nomusBlue">
                  Link
                </Text.Body2>
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Linker
