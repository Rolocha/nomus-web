/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUsernameMutation
// ====================================================

export interface UpdateUsernameMutation_updateProfile {
  __typename: 'User'
  id: string
  username: string | null
}

export interface UpdateUsernameMutation {
  updateProfile: UpdateUsernameMutation_updateProfile
}

export interface UpdateUsernameMutationVariables {
  username: string
}
