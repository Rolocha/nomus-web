/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ContactInfoInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: UpdateContactInfoMutation
// ====================================================

export interface UpdateContactInfoMutation_updateContactInfo {
  __typename: 'Connection'
  id: string
  meetingDate: any | null
  meetingPlace: string | null
  notes: string | null
}

export interface UpdateContactInfoMutation {
  updateContactInfo: UpdateContactInfoMutation_updateContactInfo
}

export interface UpdateContactInfoMutationVariables {
  contactId: string
  contactInfo: ContactInfoInput
}
