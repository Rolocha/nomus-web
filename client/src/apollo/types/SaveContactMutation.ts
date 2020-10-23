/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ContactInfoInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: SaveContactMutation
// ====================================================

export interface SaveContactMutation_saveContact {
  __typename: 'Contact'
  id: string
  username: string
  meetingDate: any | null
  meetingPlace: string | null
  notes: string | null
}

export interface SaveContactMutation {
  saveContact: SaveContactMutation_saveContact
}

export interface SaveContactMutationVariables {
  username: string
  contactInfo?: ContactInfoInput | null
}
