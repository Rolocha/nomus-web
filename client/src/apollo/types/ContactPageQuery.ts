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
  __typename: 'Contact'
  id: any
  username: string
  name: ContactPageQuery_publicContact_name
  phoneNumber: string | null
  email: string | null
  headline: string | null
  bio: string | null
  profilePicUrl: string | null
  cardFrontImageUrl: string | null
  cardBackImageUrl: string | null
  vcfUrl: string | null
  notes: string | null
  tags: string[] | null
  meetingPlace: string | null
  meetingDate: any | null
  connected: boolean | null
}

export interface ContactPageQuery {
  publicContact: ContactPageQuery_publicContact
}

export interface ContactPageQueryVariables {
  username: string
}
