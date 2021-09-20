/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CardSpecBaseType } from './globalTypes'

// ====================================================
// GraphQL mutation operation: InitializeCardBuilder
// ====================================================

export interface InitializeCardBuilder_createEmptyOrderForCardBuilder_cardVersion {
  __typename: 'CardVersion'
  id: string
}

export interface InitializeCardBuilder_createEmptyOrderForCardBuilder {
  __typename: 'Order'
  id: string
  cardVersion: InitializeCardBuilder_createEmptyOrderForCardBuilder_cardVersion
}

export interface InitializeCardBuilder {
  /**
   * Initializes a new order and associated card version for use in the Card Builder UI
   */
  createEmptyOrderForCardBuilder: InitializeCardBuilder_createEmptyOrderForCardBuilder
}

export interface InitializeCardBuilderVariables {
  baseType: CardSpecBaseType
}
