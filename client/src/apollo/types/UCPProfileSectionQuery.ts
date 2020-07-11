/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UCPProfileSectionQuery
// ====================================================

export interface UCPProfileSectionQuery_user_name {
  __typename: 'PersonName'
  first: string
  middle: string | null
  last: string
}

export interface UCPProfileSectionQuery_user {
  __typename: 'User'
  id: string
  username: string | null
  name: UCPProfileSectionQuery_user_name | null
  profilePicUrl: string | null
  headline: string | null
  phoneNumber: string | null
  email: string | null
  bio: string | null
}

export interface UCPProfileSectionQuery_cardVersion {
  __typename: 'CardVersion'
  frontImageUrl: string | null
  backImageUrl: string | null
}

export interface UCPProfileSectionQuery {
  user: UCPProfileSectionQuery_user
  cardVersion: UCPProfileSectionQuery_cardVersion | null
}
