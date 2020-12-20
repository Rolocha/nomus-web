import * as express from 'express'
import jwt from 'jsonwebtoken'

import { User, Token } from 'src/models'
import { getUserFromToken } from './util'
import { accessTokenLifespan, refreshTokenLifespan } from 'src/config'
import { TokenBody } from './types'
import { Role } from 'src/util/enums'

const authRouter = express.Router()

interface AuthResponse {
  data?: {
    tokenExp: number
    roles: Role[]
  }
  error?: {
    code: string
    message?: string
  }
}

const ACCESS_TOKEN_COOKIE_NAME = 'X-Access-Token'
const REFRESH_TOKEN_COOKIE_NAME = 'X-Refresh-Token'

const getAuthDataForAccessToken = (accessToken: string) => {
  const accessTokenBody = jwt.decode(accessToken) as TokenBody
  return {
    tokenExp: accessTokenBody.exp,
    roles: accessTokenBody.roles,
    id: accessTokenBody._id,
  }
}

const setCookies = (res: express.Response, accessToken: string, refreshToken?: string) => {
  // TODO: Add secure: true once we have HTTPS set up
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { httpOnly: true, maxAge: accessTokenLifespan })
  if (refreshToken) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
      maxAge: refreshTokenLifespan,
    })
  }
}

authRouter.post('/login', async (req, res: express.Response<AuthResponse>) => {
  const { email, password } = req.body
  try {
    const userResult = await User.mongo.findByCredentials(email, password)
    if (!userResult.isSuccess) {
      if (userResult.error.name === 'invalid-login-credentials') {
        res.status(401).json({
          error: {
            code: 'incorrect-credentials',
            message: 'Incorrect email or password.',
          },
        })
        return
      }
    }
    const user = userResult.getValue()
    const accessToken = user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    setCookies(res, accessToken, refreshToken)
    res.json({ data: getAuthDataForAccessToken(accessToken) })
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }
})

authRouter.post('/signup', async (req, res: express.Response<AuthResponse>) => {
  const { firstName, middleName, lastName, email, password } = req.body
  try {
    const user = await User.mongo.createNewUser({
      name: {
        first: firstName,
        middle: middleName,
        last: lastName,
      },
      email,
      password,
    })
    const accessToken = user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    setCookies(res, accessToken, refreshToken)
    res.json({ data: getAuthDataForAccessToken(accessToken) })
  } catch (err) {
    // Check for trying to create an account that already exists
    if (err.code === 11000) {
      res.status(400).json({
        error: {
          code: 'account-already-exists',
        },
      })
      return
    }
    // Check for malformed email address
    if (err.name === 'ValidationError') {
      if (err.errors.email) {
        res.status(400).json({
          error: {
            code: 'invalid-email',
          },
        })
        return
      }
    }
    console.log(err)
    res.status(500).end()
  }
})

authRouter.post('/logout', async (req, res: express.Response<boolean>) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
  Token.mongo.invalidate(req.cookies[REFRESH_TOKEN_COOKIE_NAME])
  res.end()
})

const refreshToken = async (req: express.Request, res: express.Response<AuthResponse>) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME]
  const userId = req.body.id

  if (userId == null || refreshToken == null || refreshToken.trim() === '') {
    return res.status(401).end()
  }

  const user = await User.mongo.findById(userId)
  if (user == null) {
    return res.status(401).end()
  }

  // Check if the specified refresh token exists and belongs to this user
  const isTokenValid = await Token.mongo.verify(refreshToken, user._id)
  if (!isTokenValid) {
    return res.status(401).json({
      error: {
        code: 'invalid-refresh-token',
        message: 'Invalid refresh token',
      },
    })
  }

  const accessToken = user.generateAccessToken()
  setCookies(res, accessToken)
  res.json({ data: getAuthDataForAccessToken(accessToken) })
}

authRouter.post('/refresh', refreshToken)
authRouter.get('/refresh', refreshToken)

export const authMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.cookies[ACCESS_TOKEN_COOKIE_NAME]
  if (token == null || token.trim() === '') {
    return next()
  }
  const userResult = await getUserFromToken(token)
  if (!userResult.isSuccess) {
    switch (userResult.error.name) {
      case 'token-expired':
        return res.status(401).end()
      case 'missing-token':
      case 'no-matching-user':
        return res.status(400).end()
      case 'jwt-error':
      case 'unknown-error':
      default:
        return res.status(500).end()
    }
  }
  const user = userResult.getValue()
  req.user = user
  next()
}

export default authRouter
