/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SubmitCustomOrderInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: SubmitCustomOrderMutation
// ====================================================

export interface SubmitCustomOrderMutation_submitCustomOrder {
  __typename: 'SubmitOrderResponse'
  orderId: string
  checkoutSession: string
}

export interface SubmitCustomOrderMutation {
  /**
   * Handles submission of an order created via the Card Builder UI for a custom user design
   */
  submitCustomOrder: SubmitCustomOrderMutation_submitCustomOrder
}

export interface SubmitCustomOrderMutationVariables {
  payload: SubmitCustomOrderInput
}
