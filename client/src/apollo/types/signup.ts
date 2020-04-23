/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SignupInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: signup
// ====================================================

export interface signup_signup {
  __typename: 'AuthSuccessResponse'
  token: string
}

export interface signup {
  signup: signup_signup
}

export interface signupVariables {
  data: SignupInput
}
