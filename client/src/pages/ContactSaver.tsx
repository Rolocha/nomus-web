import { useMutation } from '@apollo/react-hooks'
import * as React from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import { SaveContactMutation } from 'src/apollo/types/SaveContactMutation'
import saveContactMutation from 'src/mutations/saveContactMutation'
import LoadingPage from './LoadingPage'

const ContactSaver = () => {
  const { search } = useLocation()
  const [doneSaving, setDoneSaving] = React.useState(false)
  const [saveContact] = useMutation<SaveContactMutation>(saveContactMutation)
  const params = new URLSearchParams(search)
  const username = params.get('username')

  React.useEffect(() => {
    saveContact({
      variables: {
        username,
        notesData: {
          meetingDate: params.get('meetingDate'),
          meetingPlace: params.get('meetingPlace'),
          additionalNotes: params.get('additionalNotes'),
        },
      },
    }).then(() => {
      setDoneSaving(true)
    })
    // eslint-disable-next-line
  }, [])

  if (username == null) {
    return <Redirect to="/" />
  }

  return doneSaving ? (
    <Redirect to={`/dashboard/contacts/detail/${username}`} />
  ) : (
    <LoadingPage />
  )
}

export default ContactSaver
