/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderState } from './globalTypes'

// ====================================================
// GraphQL query operation: OrderDetailViewQuery
// ====================================================

export interface OrderDetailViewQuery_order_shippingAddress {
  __typename: 'Address'
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
}

export interface OrderDetailViewQuery_order_cardVersion {
  __typename: 'CardVersion'
  frontImageUrl: string | null
  backImageUrl: string | null
}

export interface OrderDetailViewQuery_order_price {
  __typename: 'OrderPrice'
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export interface OrderDetailViewQuery_order_user_name {
  __typename: 'PersonName'
  first: string
}

export interface OrderDetailViewQuery_order_user {
  __typename: 'User'
  email: string | null
  name: OrderDetailViewQuery_order_user_name | null
}

export interface OrderDetailViewQuery_order {
  __typename: 'Order'
  id: string
  shortId: string
  createdAt: any
  state: OrderState
  shippingName: string | null
  shippingAddress: OrderDetailViewQuery_order_shippingAddress | null
  cardVersion: OrderDetailViewQuery_order_cardVersion
  quantity: number | null
  price: OrderDetailViewQuery_order_price | null
  user: OrderDetailViewQuery_order_user | null
}

export interface OrderDetailViewQuery {
  order: OrderDetailViewQuery_order
}

export interface OrderDetailViewQueryVariables {
  orderId: string
}
