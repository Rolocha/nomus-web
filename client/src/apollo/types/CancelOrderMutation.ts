/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderState } from './globalTypes'

// ====================================================
// GraphQL mutation operation: CancelOrderMutation
// ====================================================

export interface CancelOrderMutation_cancelOrder {
  __typename: 'Order'
  id: string
  state: OrderState
}

export interface CancelOrderMutation {
  cancelOrder: CancelOrderMutation_cancelOrder
}

export interface CancelOrderMutationVariables {
  orderId?: string | null
}