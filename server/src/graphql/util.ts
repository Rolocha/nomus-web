import * as express from 'express'
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import MUUID from 'uuid-mongodb'
import { AuthChecker } from 'type-graphql'

import User from 'src/models/User'
import { authTokenPrivateKey } from 'src/config'
import { Result } from 'src/util/error'
import { IApolloContext } from './types'

interface TokenData {
  _id: string
}

type AuthorizationResult = Result<
  User,
  'token-expired' | 'missing-token' | 'no-matching-user' | 'jwt-error' | 'unknown-error'
>
export const authorizeRequest = async (req: express.Request): Promise<AuthorizationResult> => {
  try {
    const authHeader = req.header('Authorization')
    if (authHeader == null) {
      return Result.fail('missing-token')
    }
    const token = authHeader.replace('Bearer ', '')
    if (token == null) {
      return Result.fail('missing-token')
    }
    const data = jwt.verify(token, authTokenPrivateKey) as TokenData
    const user = await User.mongo.findOne({ _id: MUUID.from(data._id) })
    if (!user) {
      return Result.fail('no-matching-user')
    }
    return Result.ok(user)
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return Result.fail('token-expired')
    } else if (err instanceof JsonWebTokenError) {
      return Result.fail('jwt-error')
    } else {
      return Result.fail('unknown-error')
    }
  }
}

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
