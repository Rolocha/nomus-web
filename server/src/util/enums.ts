import { registerEnumType } from 'type-graphql'

//Current State in Order Tracking State Machine
//https://www.notion.so/Order-Flow-State-Machine-e44affeb35764cc488ac771fa9e28851
export enum OrderState {
  // The order object was initialized during a Card Builder flow
  // At this point, it is likely missing most of the information needed to begin processing it
  Initialized = 'Initialized',
  // The user is done creating the order and it has been captured into our system
  Captured = 'Captured',
  // The order has been completed by the user and is ready for us to action
  Actionable = 'Actionable',
  // The order has been reviewed and is approved to move to creation phase
  Reviewed = 'Reviewed',
  // The order has been sent to our printing partner
  Creating = 'Creating',
  // All sheets in the order have been printed
  Created = 'Created',
  // The order are enroute to the customer
  Enroute = 'Enroute',
  // The order have reached the customer
  Fulfilled = 'Fulfilled',
  // The order has been canceled
  Canceled = 'Canceled',
}

export const ORDER_STATES = Object.keys(OrderState) as OrderState[]

export const INITIAL_ORDER_STATE = OrderState.Initialized

// Orders shouldn't show up in the result of the `userOrders` resolver
// if they are in one of these states because it means they have only partially
// been completed in Card Builder
export const HIDDEN_ORDER_LIST_STATES = [OrderState.Initialized, OrderState.Captured]
export const VISIBLE_ORDER_LIST_STATES = ORDER_STATES.filter(
  (s) => !HIDDEN_ORDER_LIST_STATES.includes(s)
)

registerEnumType(OrderState, {
  name: 'OrderState',
  description: 'Current State in Order Tracking State Machine',
})

export enum SheetState {
  Created = 'Created',
  Received = 'Received',
  Printed = 'Printed',
}

registerEnumType(SheetState, {
  name: 'SheetState',
  description: 'Current state in Sheet state machine',
})

// Triggers for OrderState changes, stored in OrderEvent collection
export enum OrderEventTrigger {
  Nomus = 'Nomus', // nomus code performs a state transition
  Transport = 'Transport', // our shipping partners notify us on change
  Payment = 'Payment', // payment partner notifies us of payment received
  Printer = 'Printer', // printing partner has received or printed materials
  Internal = 'Internal', // used our Admin Panel for some manual triage
}

registerEnumType(OrderEventTrigger, {
  name: 'OrderEventTrigger',
  description: 'Triggers for OrderState stored in OrderEvent collection',
})

export enum OrderCreatedBy {
  CardBuilder = 'CardBuilder',
  Manual = 'Manual',
}

// Needs to stay in sync with the enum at client/src/utils/auth/index.ts
export enum Role {
  User = 'user',
  Admin = 'admin',
  PrintTech = 'print-tech',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User access control roles',
})

export enum CardSpecBaseType {
  Custom = 'Custom',
  Template = 'Template',
}

registerEnumType(CardSpecBaseType, {
  name: 'CardSpecBaseType',
  description: 'The base type for a card being built',
})

export enum CardInteractionType {
  Tap = 'tap',
  QRCode = 'qr-code',
  Unknown = 'unknown',
}

registerEnumType(CardInteractionType, {
  name: 'CardInteractionType',
  description: 'How a card was interacted with by the receiver',
})

export enum NomusProFeature {
  UseCustomTapLink = 'UseCustomTapLink',
}

registerEnumType(NomusProFeature, {
  name: 'NomusProFeature',
  description: 'Features available in Nomus Pro',
})

export enum BillableProduct {
  NomusPro = 'NomusPro',
}
