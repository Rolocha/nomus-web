import { gql } from 'src/apollo'

export default gql`
  mutation SaveContactMutation(
    $username: String!
    $contactInfo: ContactInfoInput
  ) {
    saveContact(username: $username, contactInfo: $contactInfo) {
      id
      username
      meetingDate
      meetingPlace
      notes
    }
  }
`
