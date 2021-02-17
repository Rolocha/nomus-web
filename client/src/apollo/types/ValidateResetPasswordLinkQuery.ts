/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ValidateResetPasswordLinkQuery
// ====================================================

export interface ValidateResetPasswordLinkQuery {
  /**
   * Validates whether the reset password token is valid and non-expired
   */
  validateResetPasswordLink: any | null
}

export interface ValidateResetPasswordLinkQueryVariables {
  token: string
  userId: string
}
