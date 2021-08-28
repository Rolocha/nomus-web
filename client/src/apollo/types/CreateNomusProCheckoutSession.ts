/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NomusProFeature } from './globalTypes'

// ====================================================
// GraphQL mutation operation: CreateNomusProCheckoutSession
// ====================================================

export interface CreateNomusProCheckoutSession_createNomusProCheckoutSession {
  __typename: 'NomusProCheckoutSession'
  url: string
}

export interface CreateNomusProCheckoutSession {
  createNomusProCheckoutSession: CreateNomusProCheckoutSession_createNomusProCheckoutSession | null
}

export interface CreateNomusProCheckoutSessionVariables {
  triggerFeature?: NomusProFeature | null
}
