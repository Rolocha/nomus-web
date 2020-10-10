import { gql } from 'src/apollo'

export default gql`
  mutation SaveContactMutation($username: String!, $notesData: NotesDataInput) {
    saveContact(username: $username, notesData: $notesData) {
      id
      username
      meetingDate
      meetingPlace
      notes
    }
  }
`
