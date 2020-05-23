import MUUID from 'uuid-mongodb'
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'

import User from 'src/models/User'
import { authTokenPrivateKey } from 'src/config'
import { Result } from 'src/util/error'
import { TokenBody } from './types'

interface Options {
  ignoreExpiration: boolean
}

const defaultOptions = {
  ignoreExpiration: false,
}

type AuthorizationResult = Result<
  User,
  'token-expired' | 'missing-token' | 'no-matching-user' | 'jwt-error' | 'unknown-error'
>
export const getUserFromToken = async (
  token: string,
  options?: Options
): Promise<AuthorizationResult> => {
  const _options = { ...defaultOptions, ...options }
  try {
    if (token == null || token.trim() === '') {
      return Result.fail('missing-token')
    }
    const data = jwt.verify(token, authTokenPrivateKey, {
      ignoreExpiration: _options.ignoreExpiration,
    }) as TokenBody
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
