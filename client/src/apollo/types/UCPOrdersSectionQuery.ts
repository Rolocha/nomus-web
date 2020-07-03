/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderState } from "./globalTypes";

// ====================================================
// GraphQL query operation: UCPOrdersSectionQuery
// ====================================================

export interface UCPOrdersSectionQuery_orders_cardVersion {
  __typename: "CardVersion";
  frontImageUrl: string | null;
  backImageUrl: string | null;
}

export interface UCPOrdersSectionQuery_orders {
  __typename: "Order";
  id: string;
  cardVersion: UCPOrdersSectionQuery_orders_cardVersion;
  price: number;
  quantity: number | null;
  state: OrderState;
  createdAt: any;
  trackingNumber: string | null;
}

export interface UCPOrdersSectionQuery {
  orders: UCPOrdersSectionQuery_orders[] | null;
}
