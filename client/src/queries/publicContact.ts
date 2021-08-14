import { gql } from 'src/apollo'

export default gql`
  query ContactPageQuery($username: String!) {
    publicContact(username: $username) {
      id
      username
      name {
        first
        middle
        last
      }
      phoneNumber
      email
      headline
      bio
      profilePicUrl
      cardFrontImageUrl
      cardBackImageUrl
      vcfUrl
      notes
      tags
      meetingPlace
      meetingDate
      connected
      position
      company
    }
  }
`
