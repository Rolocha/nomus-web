/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LinkSheetToUserQuery
// ====================================================

export interface LinkSheetToUserQuery_linkSheetToUser {
  __typename: "LinkedInfo";
  userId: string | null;
  sheetId: string | null;
  error: string | null;
}

export interface LinkSheetToUserQuery {
  /**
   * When a technician is done printing, link the cards to their user
   */
  linkSheetToUser: LinkSheetToUserQuery_linkSheetToUser;
}

export interface LinkSheetToUserQueryVariables {
  routeStr: string;
  shortId: string;
}
