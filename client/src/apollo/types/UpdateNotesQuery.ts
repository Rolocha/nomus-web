/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NotesInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateNotesQuery
// ====================================================

export interface UpdateNotesQuery_updateNotes {
  __typename: "Connection";
  meetingDate: any | null;
  meetingPlace: string | null;
  notes: string | null;
}

export interface UpdateNotesQuery {
  updateNotes: UpdateNotesQuery_updateNotes;
}

export interface UpdateNotesQueryVariables {
  contactId: string;
  notesInput: NotesInput;
}
