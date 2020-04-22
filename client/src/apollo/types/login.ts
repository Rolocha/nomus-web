/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: login
// ====================================================

export interface login_login {
  __typename: 'AuthSuccessResponse'
  token: string
}

export interface login {
  login: login_login
}

export interface loginVariables {
  email: string
  password: string
}
