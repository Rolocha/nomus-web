import * as React from 'react'
import * as Text from 'src/components/Text'
import * as Form from 'src/components/Form'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from 'src/apollo'
import { LinkSheetToUserQuery } from 'src/apollo/types/LinkSheetToUserQuery'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import Button from 'src/components/Button'

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
const LinkerPage = () => {
  const {
    register: linkerFormRegister,
    handleSubmit: linkerFormHandleSubmit,
  } = useForm<LinkerFormData>()
  const [linkSheet] = useMutation<LinkSheetToUserQuery>(LINKER_MUTATION)
  const [isFailureState, setIsFailureState] = React.useState(false)
  const [isSuccessState, setIsSuccessState] = React.useState(false)
  const [extraInfo, setExtraInfo] = React.useState('No Info')

  const onSubmitLinker = async (formData: LinkerFormData) => {
    if (formData.shortId) {
      const currUrl = window.location.pathname.split('/')
      const routeStr = currUrl[currUrl.length - 1]
      try {
        const response = await linkSheet({
          variables: {
            routeStr: routeStr,
            shortId: formData.shortId,
          },
        })
        console.log(response)
        if (response.errors) {
          setExtraInfo(response.errors.toString())
          setIsFailureState(true)
        } else {
          setExtraInfo(response.data?.linkSheetToUser.userId || '')
          setIsSuccessState(true)
        }
      } catch (e) {
        setExtraInfo(e.message)
        setIsFailureState(true)
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
            {!(isSuccessState || isFailureState) && (
              <Text.PageHeader>Sheet Linker</Text.PageHeader>
            )}
          </Box>

          <Box gridArea="explain">
            {!(isSuccessState || isFailureState) && (
              <Box>
                <Text.Body>This page is to link cards to a User.</Text.Body>
                <Text.Body>
                  For any questions, email help@nomus.me and we'll get it
                  sorted!
                </Text.Body>
              </Box>
            )}
          </Box>
          <Box gridArea="instructions">
            {!(isSuccessState || isFailureState) && (
              <Text.Body>
                Please enter the 6 digit alphanumeric ID found on the long edge
                of the printed sheet below
              </Text.Body>
            )}
          </Box>
          <Box gridArea="inputForm">
            {!(isSuccessState || isFailureState) && (
              <Box>
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
            )}
          </Box>
          <Box gridArea="buttonSection">
            {!(isSuccessState || isFailureState) && (
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
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LinkerPage
