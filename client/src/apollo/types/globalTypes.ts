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
  Captured = "Captured",
  Created = "Created",
  Creating = "Creating",
  Enroute = "Enroute",
  Fulfilled = "Fulfilled",
  Paid = "Paid",
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
}

//==============================================================
// END Enums and Input Objects
//==============================================================
