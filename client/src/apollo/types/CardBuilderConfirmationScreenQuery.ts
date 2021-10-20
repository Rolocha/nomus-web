/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CardBuilderConfirmationScreenQuery
// ====================================================

export interface CardBuilderConfirmationScreenQuery_order_shippingAddress {
  __typename: 'Address'
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
}

export interface CardBuilderConfirmationScreenQuery_order_cardVersion {
  __typename: 'CardVersion'
  frontImageUrl: string | null
  backImageUrl: string | null
}

export interface CardBuilderConfirmationScreenQuery_order_price {
  __typename: 'OrderPrice'
  total: number
}

export interface CardBuilderConfirmationScreenQuery_order_user_name {
  __typename: 'PersonName'
  first: string
}

export interface CardBuilderConfirmationScreenQuery_order_user {
  __typename: 'User'
  email: string | null
  name: CardBuilderConfirmationScreenQuery_order_user_name | null
}

export interface CardBuilderConfirmationScreenQuery_order {
  __typename: 'Order'
  id: string
  createdAt: any
  shortId: string
  shippingName: string | null
  shippingAddress: CardBuilderConfirmationScreenQuery_order_shippingAddress | null
  cardVersion: CardBuilderConfirmationScreenQuery_order_cardVersion
  quantity: number | null
  price: CardBuilderConfirmationScreenQuery_order_price | null
  user: CardBuilderConfirmationScreenQuery_order_user | null
}

export interface CardBuilderConfirmationScreenQuery {
  order: CardBuilderConfirmationScreenQuery_order
}

export interface CardBuilderConfirmationScreenQueryVariables {
  orderId: string
}
