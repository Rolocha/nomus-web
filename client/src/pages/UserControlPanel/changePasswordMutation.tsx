import { gql } from 'src/apollo'

export default gql`
  mutation ChangePasswordQuery(
    $oldPassword: String!
    $newPassword: String!
    $confirmNewPassword: String!
  ) {
    changePassword(
      oldPassword: $oldPassword
      newPassword: $newPassword
      confirmNewPassword: $confirmNewPassword
    ) {
      id
    }
  }
`
