/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserControlPanelSkeletonQuery
// ====================================================

export interface UserControlPanelSkeletonQuery_user_name {
  __typename: 'PersonName'
  first: string
  middle: string | null
  last: string
}

export interface UserControlPanelSkeletonQuery_user {
  __typename: 'User'
  id: string
  name: UserControlPanelSkeletonQuery_user_name | null
  email: string | null
  isEmailVerified: boolean
}

export interface UserControlPanelSkeletonQuery {
  user: UserControlPanelSkeletonQuery_user
}
