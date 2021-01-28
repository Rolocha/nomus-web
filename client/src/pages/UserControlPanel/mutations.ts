import { gql } from 'src/apollo'

export const CHANGE_ACTIVE_CARD_VERSION = gql`
  mutation ChangeActiveCardVersion($cardVersionId: String!) {
    changeActiveCardVersion(cardVersionId: $cardVersionId) {
      id
      defaultCardVersion {
        id
        createdAt
        frontImageUrl
        backImageUrl
      }
    }
  }
`

export const UPDATE_USER_CHECKPOINTS = gql`
  mutation UpdateUserCheckpoints($checkpointsReached: [String!]!) {
    updateUserCheckpoints(checkpointsReached: $checkpointsReached) {
      id
      checkpoints {
        expressedInterestInOrderingNomusCard
      }
    }
  }
`

export const CHANGE_PASSWORD_MUTATION = gql`
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

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfileQuery($updatedUser: ProfileUpdateInput!) {
    updateProfile(updatedUser: $updatedUser) {
      id
      name {
        first
        middle
        last
      }
      profilePicUrl
      headline
      phoneNumber
      email
      isEmailVerified
      bio
      activated
    }
  }
`

export const UPDATE_USERNAME_MUTATION = gql`
  mutation UpdateUsernameMutation($username: String!) {
    updateProfile(username: $username) {
      id
      username
    }
  }
`
