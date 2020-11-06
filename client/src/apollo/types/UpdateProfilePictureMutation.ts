/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProfilePictureMutation
// ====================================================

export interface UpdateProfilePictureMutation_updateProfilePicture {
  __typename: 'User'
  id: string
  /**
   * A URL pointing to the user's profile picture
   */
  profilePicUrl: string | null
}

export interface UpdateProfilePictureMutation {
  updateProfilePicture: UpdateProfilePictureMutation_updateProfilePicture
}

export interface UpdateProfilePictureMutationVariables {
  file: any
}
