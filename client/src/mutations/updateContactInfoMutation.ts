import { gql } from 'src/apollo'

export default gql`
  mutation UpdateContactInfoMutation(
    $contactId: String!
    $contactInfo: ContactInfoInput!
  ) {
    updateContactInfo(contactId: $contactId, contactInfo: $contactInfo) {
      id
      meetingDate
      meetingPlace
      notes
      tags
    }
  }
`
