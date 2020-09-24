/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContactByUsernameQuery
// ====================================================

export interface ContactByUsernameQuery_contactByUsername_name {
  __typename: 'PersonName'
  first: string
  middle: string | null
  last: string
}

export interface ContactByUsernameQuery_contactByUsername {
  __typename: 'Contact'
  id: any
  username: string
  name: ContactByUsernameQuery_contactByUsername_name
  phoneNumber: string | null
  email: string | null
  headline: string | null
  bio: string | null
  profilePicUrl: string | null
  cardFrontImageUrl: string | null
  cardBackImageUrl: string | null
  vcfUrl: string | null
  meetingDate: any | null
  meetingPlace: string | null
  notes: string | null
}

export interface ContactByUsernameQuery {
  contactByUsername: ContactByUsernameQuery_contactByUsername
}

export interface ContactByUsernameQueryVariables {
  contactUsername?: string | null
}
