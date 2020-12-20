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
  meetingDate: string | null
  meetingPlace: string | null
  tags: string[] | null
  notes: string | null
}

export interface SaveContactMutation {
  /**
   * Creates a new Contact or updates the information associated with an existing contact
   */
  saveContact: SaveContactMutation_saveContact
}

export interface SaveContactMutationVariables {
  username: string
  contactInfo?: ContactInfoInput | null
}
