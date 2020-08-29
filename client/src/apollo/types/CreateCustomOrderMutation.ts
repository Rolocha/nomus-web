/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateCustomOrderInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: CreateCustomOrderMutation
// ====================================================

export interface CreateCustomOrderMutation_createCustomOrder {
  __typename: 'CreateOrderResponse'
  clientSecret: string
  orderId: string
}

export interface CreateCustomOrderMutation {
  createCustomOrder: CreateCustomOrderMutation_createCustomOrder
}

export interface CreateCustomOrderMutationVariables {
  payload: CreateCustomOrderInput
}
