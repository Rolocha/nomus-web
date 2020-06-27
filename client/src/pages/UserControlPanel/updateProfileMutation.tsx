import { gql } from 'src/apollo'

export default gql`
  mutation UpdateProfileQuery($updatedUser: ProfileUpdateInput!) {
    updateProfile(updatedUser: $updatedUser) {
      id
      username
      name {
        first
        middle
        last
      }
      profilePicUrl
      headline
      phoneNumber
      email
      bio
      activated
    }
  }
`
