/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpsertCustomOrderInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: UpsertCustomOrderMutation
// ====================================================

export interface UpsertCustomOrderMutation_upsertCustomOrder {
  __typename: 'UpsertOrderResponse'
  clientSecret: string
  orderId: string
}

export interface UpsertCustomOrderMutation {
  upsertCustomOrder: UpsertCustomOrderMutation_upsertCustomOrder
}

export interface UpsertCustomOrderMutationVariables {
  payload: UpsertCustomOrderInput
}
