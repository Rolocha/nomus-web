import { AuthChecker } from 'type-graphql'

import { IApolloContext } from './types'

export const schemaAuthChecker: AuthChecker<IApolloContext> = (
  { root, args, context: { user }, info },
  roles
) => {
  // If no user on context, just verify that no roles needed for this action
  if (user == null) {
    return roles.length === 0
  }

  // If user has one of the roles required for this action
  if (user.roles.some((role) => roles.includes(role))) {
    return true
  }

  return false
}
