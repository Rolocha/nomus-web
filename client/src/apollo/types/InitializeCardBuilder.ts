/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InitializeCardBuilder
// ====================================================

export interface InitializeCardBuilder_createEmptyCardVersion {
  __typename: 'CardVersion'
  id: string
}

export interface InitializeCardBuilder {
  /**
   * Initializes a bare card version for use in the Card Builder UI
   */
  createEmptyCardVersion: InitializeCardBuilder_createEmptyCardVersion
}
