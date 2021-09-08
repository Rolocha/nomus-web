import { registerEnumType } from 'type-graphql'

//Current State in Order Tracking State Machine
//https://www.notion.so/Order-Flow-State-Machine-e44affeb35764cc488ac771fa9e28851
export enum OrderState {
  Captured = 'Captured',
  Actionable = 'Actionable',
  Reviewed = 'Reviewed',
  Creating = 'Creating',
  Created = 'Created',
  Enroute = 'Enroute',
  Fulfilled = 'Fulfilled',
  Canceled = 'Canceled',
}

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
  Manual = 'Manual',
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
