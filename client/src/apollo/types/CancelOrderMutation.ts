/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderState } from './globalTypes'

// ====================================================
// GraphQL mutation operation: CancelOrderMutation
// ====================================================

export interface CancelOrderMutation_transitionOrderState {
  __typename: 'Order'
  id: string
  state: OrderState
}

export interface CancelOrderMutation {
  transitionOrderState: CancelOrderMutation_transitionOrderState
}

export interface CancelOrderMutationVariables {
  orderId?: string | null
  futureState?: string | null
}
