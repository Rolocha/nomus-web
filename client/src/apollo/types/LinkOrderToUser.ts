/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LinkOrderToUser
// ====================================================

export interface LinkOrderToUser_linkOrderToUser {
  __typename: 'SubmitOrderResponse'
  orderId: string
  checkoutSession: string | null
}

export interface LinkOrderToUser {
  /**
   * Links an orphan order to a user
   */
  linkOrderToUser: LinkOrderToUser_linkOrderToUser
}

export interface LinkOrderToUserVariables {
  orderId: string
}
