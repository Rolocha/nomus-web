import { UnauthorizedError, AuthChecker, createMethodDecorator } from 'type-graphql'

import { IApolloContext } from './types'
import { Role } from 'src/util/enums'

export interface AuthDef {
  requiredRoles: Role[]
  adminOnlyArgs?: string[]
}

export const schemaAuthChecker: AuthChecker<IApolloContext, Role> = (
  { context: { user } },
  roles
) => {
  // If no user on context, just verify that no roles needed for this action
  if (user == null) {
    return roles.length === 0
  }

  // Ensure user has every role required to see this route
  if (!roles.every((role) => user.roles.includes(role))) {
    return false
  }

  return true
}

// Custom resolver method decorator that lets us protect specific parameters for admin-only use
// Example use case: the "user" query
//   - used by regular users without specifying userId, returns user from context
//   - used by admins specifying userId, returns specified user
export function AdminOnlyArgs(...adminOnlyFields: string[]) {
  return createMethodDecorator<IApolloContext>(async ({ args, context: { user } }, next) => {
    if (
      user &&
      !user.roles.includes(Role.Admin) &&
      adminOnlyFields.some((field) => args.hasOwnProperty(field))
    ) {
      throw new UnauthorizedError()
    }
    return next()
  })
}
