/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderCancelationState } from './globalTypes'

// ====================================================
// GraphQL mutation operation: CancelOrderMutation
// ====================================================

export interface CancelOrderMutation_cancelOrder {
  __typename: 'Order'
  id: string
  cancelationState: OrderCancelationState
}

export interface CancelOrderMutation {
  cancelOrder: CancelOrderMutation_cancelOrder
}

export interface CancelOrderMutationVariables {
  orderId?: string | null
}
