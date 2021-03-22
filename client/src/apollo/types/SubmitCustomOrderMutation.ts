/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SubmitCustomOrderInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: SubmitCustomOrderMutation
// ====================================================

export interface SubmitCustomOrderMutation_submitCustomOrder {
  __typename: 'SubmitCustomOrderResponse'
  clientSecret: string
  orderId: string
}

export interface SubmitCustomOrderMutation {
  submitCustomOrder: SubmitCustomOrderMutation_submitCustomOrder
}

export interface SubmitCustomOrderMutationVariables {
  payload: SubmitCustomOrderInput
}
