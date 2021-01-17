/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderState, OrderCancelationState } from './globalTypes'

// ====================================================
// GraphQL query operation: UCPOrdersSectionQuery
// ====================================================

export interface UCPOrdersSectionQuery_orders_cardVersion {
  __typename: 'CardVersion'
  frontImageUrl: string | null
  backImageUrl: string | null
}

export interface UCPOrdersSectionQuery_orders_price {
  __typename: 'OrderPrice'
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export interface UCPOrdersSectionQuery_orders {
  __typename: 'Order'
  id: string
  cardVersion: UCPOrdersSectionQuery_orders_cardVersion
  price: UCPOrdersSectionQuery_orders_price
  quantity: number
  state: OrderState
  createdAt: any
  trackingNumber: string | null
  cancelationState: OrderCancelationState
}

export interface UCPOrdersSectionQuery {
  orders: UCPOrdersSectionQuery_orders[] | null
}
