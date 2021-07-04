/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUsernameMutation
// ====================================================

export interface UpdateUsernameMutation_updateUsername {
  __typename: "User";
  id: string;
  username: string | null;
}

export interface UpdateUsernameMutation {
  updateUsername: UpdateUsernameMutation_updateUsername;
}

export interface UpdateUsernameMutationVariables {
  username: string;
}
