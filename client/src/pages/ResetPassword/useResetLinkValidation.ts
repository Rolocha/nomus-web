import gql from 'graphql-tag'
import * as React from 'react'
import { useLazyQuery } from 'src/apollo'
import { ErrorCodes } from 'src/apollo/error-codes'
import { ValidateResetPasswordLinkQuery } from 'src/apollo/types/ValidateResetPasswordLinkQuery'

// React hook to validate that the /reset-password?token=<TOKEN>&userId=<USERID> link is valid and would result in a successful password reset
// We need to use this validation on page-load to ensure that the user isn't potentially left filling out their new password only to be denied
// update access due to an expired token
export const useResetLinkValidation = ({
  token,
  userId,
}: {
  token: string | null
  userId: string | null
}): 'invalid' | 'expired' | 'valid' | null => {
  const areParamsValid = !(
    token == null ||
    token === '' ||
    userId == null ||
    userId === ''
  )

  const [
    validateResetLinkOnServer,
    { data, loading, error, called },
  ] = useLazyQuery<ValidateResetPasswordLinkQuery>(
    gql`
      query ValidateResetPasswordLinkQuery($token: String!, $userId: String!) {
        validateResetPasswordLink(token: $token, userId: $userId)
      }
    `,
    {
      variables: {
        token,
        userId,
      },
    },
  )

  React.useEffect(() => {
    if (!called && areParamsValid) {
      validateResetLinkOnServer()
    }
  }, [called, areParamsValid, validateResetLinkOnServer])

  debugger
  if (!areParamsValid) return 'invalid'
  if (!called || loading) return null
  if (
    error &&
    error.graphQLErrors[0].extensions?.code === ErrorCodes.Unauthenticated
  ) {
    return 'expired'
  }
  if (data && data.validateResetPasswordLink) return 'valid'
  return 'invalid'
}
