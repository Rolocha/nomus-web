import { registerEnumType } from 'type-graphql'

//Current State in Order Tracking State Machine
//https://www.notion.so/Order-Flow-State-Machine-e44affeb35764cc488ac771fa9e28851
export enum OrderState {
  Captured = 'captured',
  Paid = 'paid',
  Creating = 'creating',
  Created = 'created',
  Enroute = 'enroute',
  Fulfilled = 'fulfilled',
}

registerEnumType(OrderState, {
  name: 'OrderState',
  description: 'foo',
})

// Needs to stay in sync with the enum at client/src/utils/auth/index.ts
export enum Role {
  User = 'user',
  Admin = 'admin',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User access control roles',
})