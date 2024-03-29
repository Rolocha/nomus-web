/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UCPContactsSectionQuery
// ====================================================

export interface UCPContactsSectionQuery_contacts_name {
  __typename: 'PersonName'
  first: string
  middle: string | null
  last: string
}

export interface UCPContactsSectionQuery_contacts {
  __typename: 'Contact'
  id: string
  username: string
  name: UCPContactsSectionQuery_contacts_name
  phoneNumber: string | null
  email: string | null
  headline: string | null
  bio: string | null
  position: string | null
  company: string | null
  profilePicUrl: string | null
  website: string | null
  cardFrontImageUrl: string | null
  cardBackImageUrl: string | null
  notes: string | null
  tags: string[] | null
  vcfUrl: string | null
  meetingPlace: string | null
  meetingDate: string | null
}

export interface UCPContactsSectionQuery {
  contacts: UCPContactsSectionQuery_contacts[]
}
