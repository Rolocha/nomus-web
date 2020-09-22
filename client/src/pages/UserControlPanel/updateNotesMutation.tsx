import { gql } from 'src/apollo'

export default gql`
  mutation UpdateNotesQuery($contactId: String!, $notesInput: NotesInput!) {
    updateNotes(contactId: $contactId, notesInput: $notesInput) {
      id
      meetingDate
      meetingPlace
      notes
    }
  }
`
