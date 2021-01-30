/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangePasswordQuery
// ====================================================

export interface ChangePasswordQuery_changePassword {
  __typename: 'User'
  id: string
}

export interface ChangePasswordQuery {
  changePassword: ChangePasswordQuery_changePassword
}

export interface ChangePasswordQueryVariables {
  currentPassword: string
  newPassword: string
}
