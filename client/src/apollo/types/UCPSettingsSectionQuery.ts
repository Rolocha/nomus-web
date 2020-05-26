/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UCPSettingsSectionQuery
// ====================================================

export interface UCPSettingsSectionQuery_user_name {
  __typename: 'PersonName'
  first: string
  middle: string | null
  last: string
}

export interface UCPSettingsSectionQuery_user {
  __typename: 'User'
  id: string
  username: string | null
  name: UCPSettingsSectionQuery_user_name | null
  email: string | null
}

export interface UCPSettingsSectionQuery {
  user: UCPSettingsSectionQuery_user
}
