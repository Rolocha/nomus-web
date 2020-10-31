import { useMutation } from '@apollo/react-hooks'
import * as React from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import { SaveContactMutation } from 'src/apollo/types/SaveContactMutation'
import saveContactMutation from 'src/mutations/saveContactMutation'
import LoadingPage from './LoadingPage'

const ContactSaver = () => {
  const { search } = useLocation()
  const [saveState, setSaveState] = React.useState<
    null | 'saving' | 'failed' | 'succeeded'
  >(null)
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
          notes: params.get('notes'),
        },
      },
    })
      .then(() => {
        setSaveState('succeeded')
      })
      .catch((error) => {
        // Failure could be due to invalid username, attempted saving of existing contact, or server error
        setSaveState('failed')
      })
    // Want an empty array of deps to ensure this runs just once on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (username == null || saveState === 'failed') {
    // TODO: Should this redirect somewhere more informative about the error?
    // In reality, no user story should ever lead to this branch being true
    return <Redirect to="/dashboard/contacts" />
  }

  if (saveState === 'succeeded') {
    return <Redirect to={`/dashboard/contacts/detail/${username}`} />
  }

  return <LoadingPage />
}

export default ContactSaver
