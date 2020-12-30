import * as React from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from 'src/apollo'
import { LinkSheetToUserQuery } from 'src/apollo/types/LinkSheetToUserQuery'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'

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
        ></Box>
      </Box>
    </Box>
  )
}
