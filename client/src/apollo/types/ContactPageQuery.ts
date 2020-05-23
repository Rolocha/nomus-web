/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContactPageQuery
// ====================================================

export interface ContactPageQuery_publicContact_name {
  __typename: 'PersonName'
  first: string
  middle: string | null
  last: string
}

export interface ContactPageQuery_publicContact {
  __typename: 'CardVersion'
  frontImageUrl: string
  vcfUrl: string
  name: ContactPageQuery_publicContact_name | null
}

export interface ContactPageQuery {
  publicContact: ContactPageQuery_publicContact
}

export interface ContactPageQueryVariables {
  username: string
  cardNameOrId?: string | null
}
