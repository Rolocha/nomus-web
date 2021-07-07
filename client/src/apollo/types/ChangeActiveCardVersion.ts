/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeActiveCardVersion
// ====================================================

export interface ChangeActiveCardVersion_changeActiveCardVersion_defaultCardVersion {
  __typename: "CardVersion";
  id: string;
  createdAt: any;
  frontImageUrl: string | null;
  backImageUrl: string | null;
}

export interface ChangeActiveCardVersion_changeActiveCardVersion {
  __typename: "User";
  id: string;
  defaultCardVersion: ChangeActiveCardVersion_changeActiveCardVersion_defaultCardVersion | null;
}

export interface ChangeActiveCardVersion {
  changeActiveCardVersion: ChangeActiveCardVersion_changeActiveCardVersion;
}

export interface ChangeActiveCardVersionVariables {
  cardVersionId: string;
}
