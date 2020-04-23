/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: currentUser
// ====================================================

export interface currentUser_currentUser_name {
  __typename: 'PersonName'
  first: string
  last: string
}

export interface currentUser_currentUser {
  __typename: 'User'
  name: currentUser_currentUser_name | null
  email: string
  phoneNumber: string
}

export interface currentUser {
  currentUser: currentUser_currentUser
}
