/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SubmitTemplateOrderInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: SubmitTemplateOrderMutation
// ====================================================

export interface SubmitTemplateOrderMutation_submitTemplateOrder {
  __typename: 'SubmitOrderResponse'
  clientSecret: string
  orderId: string
}

export interface SubmitTemplateOrderMutation {
  /**
   * Handles submission of an order created via the Card Builder UI for a template-based design
   */
  submitTemplateOrder: SubmitTemplateOrderMutation_submitTemplateOrder
}

export interface SubmitTemplateOrderMutationVariables {
  payload: SubmitTemplateOrderInput
}
