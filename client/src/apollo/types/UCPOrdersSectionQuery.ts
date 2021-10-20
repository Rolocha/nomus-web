/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderState } from './globalTypes'

// ====================================================
// GraphQL query operation: UCPOrdersSectionQuery
// ====================================================

export interface UCPOrdersSectionQuery_userOrders_cardVersion {
  __typename: 'CardVersion'
  frontImageUrl: string | null
  backImageUrl: string | null
}

export interface UCPOrdersSectionQuery_userOrders_price {
  __typename: 'OrderPrice'
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
}

export interface UCPOrdersSectionQuery_userOrders {
  __typename: 'Order'
  id: string
  shortId: string
  cardVersion: UCPOrdersSectionQuery_userOrders_cardVersion
  price: UCPOrdersSectionQuery_userOrders_price | null
  quantity: number | null
  state: OrderState
  createdAt: any
  trackingNumber: string | null
}

export interface UCPOrdersSectionQuery {
  userOrders: UCPOrdersSectionQuery_userOrders[] | null
}
