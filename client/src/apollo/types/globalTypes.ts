/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Current State in Order Tracking State Machine
 */
export enum OrderState {
  Canceled = 'Canceled',
  Captured = 'Captured',
  Created = 'Created',
  Creating = 'Creating',
  Enroute = 'Enroute',
  Fulfilled = 'Fulfilled',
  Paid = 'Paid',
}

export interface AddressInput {
  line1: string
  line2?: string | null
  city: string
  state: string
  postalCode: string
}

/**
 * Information one user saves about another such as meeting date, meeting place, and tags
 */
export interface ContactInfoInput {
  meetingPlace?: string | null
  meetingDate?: string | null
  notes?: string | null
  tags?: string[] | null
}

/**
 * Specification for a card built using custom assets
 */
export interface CustomCardSpecInput {
  cardSlug?: string | null
  vcfNotes?: string | null
  frontImageDataUrl: string
  backImageDataUrl?: string | null
}

/**
 * Input for udpating user profile
 */
export interface ProfileUpdateInput {
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
  email?: string | null
  headline?: string | null
  bio?: string | null
  activated?: boolean | null
}

/**
 * Payload for submitting an order
 */
export interface SubmitCustomOrderInput {
  orderId?: string | null
  quantity?: number | null
  stripeToken?: string | null
  shippingAddress?: AddressInput | null
  cardSpec: CustomCardSpecInput
}

//==============================================================
// END Enums and Input Objects
//==============================================================
