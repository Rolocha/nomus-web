/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProfilePageQuery
// ====================================================

export interface ProfilePageQuery_user_name {
  __typename: 'PersonName'
  first: string
  last: string
}

export interface ProfilePageQuery_user {
  __typename: 'User'
  name: ProfilePageQuery_user_name | null
  email: string | null
  phoneNumber: string | null
}

export interface ProfilePageQuery {
  user: ProfilePageQuery_user
}
