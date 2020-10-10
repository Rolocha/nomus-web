/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NotesDataInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: SaveContactMutation
// ====================================================

export interface SaveContactMutation_saveContact {
  __typename: 'Contact'
  id: any
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
  notesData?: NotesDataInput | null
}
