/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContactPageQuery
// ====================================================

export interface ContactPageQuery_contactInfo_name {
  __typename: 'PersonName'
  first: string
  middle: string | null
  last: string
}

export interface ContactPageQuery_contactInfo {
  __typename: 'CardVersion'
  imageUrl: string
  vcfUrl: string
  name: ContactPageQuery_contactInfo_name | null
}

export interface ContactPageQuery {
  contactInfo: ContactPageQuery_contactInfo
}

export interface ContactPageQueryVariables {
  username: string
  cardNameOrId?: string | null
}
