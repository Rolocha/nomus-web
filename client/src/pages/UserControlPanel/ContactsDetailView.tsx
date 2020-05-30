import * as React from 'react'
import { useParams } from 'react-router-dom'
import Box from 'src/components/Box'

interface ParamsType {
  usernameOrId: string
}

interface Props {}

const ContactsDetailView = (props: Props) => {
  const { usernameOrId } = useParams<ParamsType>()

  return <Box>Detail view for {usernameOrId}</Box>
}

export default ContactsDetailView
