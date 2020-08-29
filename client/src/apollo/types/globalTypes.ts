/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * foo
 */
export enum OrderState {
  Captured = 'Captured',
  Created = 'Created',
  Creating = 'Creating',
  Enroute = 'Enroute',
  Fulfilled = 'Fulfilled',
  Paid = 'Paid',
}

/**
 * Input to generate new Order object
 */
export interface CreateCustomOrderInput {
  quantity: number
  stripeToken: string
  shippingAddress: ShippingAddressInput
  cardSpec: CustomCardSpecInput
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
  username?: string | null
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
 * A shipping address input
 */
export interface ShippingAddressInput {
  line1: string
  line2?: string | null
  city: string
  state: string
  postalCode: string
}

//==============================================================
// END Enums and Input Objects
//==============================================================
