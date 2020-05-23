import * as express from 'express'
import jwt from 'jsonwebtoken'
import MUUID from 'uuid-mongodb'

import { User, Token } from 'src/models'
import { Role } from 'src/models/User'
import { getUserFromToken } from './util'
import { accessTokenLifespan, refreshTokenLifespan } from 'src/config'
import { TokenBody } from './types'

const authRouter = express.Router()

interface ServerErrorResponse {
  message: string
}

type Failable<T> = T | ServerErrorResponse

interface AuthResponse {
  tokenExp: number
  roles: Role[]
}

const ACCESS_TOKEN_COOKIE_NAME = 'X-Access-Token'
const REFRESH_TOKEN_COOKIE_NAME = 'X-Refresh-Token'

const getPublicResponseForAccessToken = (accessToken: string) => {
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

authRouter.post('/login', async (req, res: express.Response<Failable<AuthResponse>>) => {
  const { email, password } = req.body
  try {
    const user = await User.mongo.findByCredentials(email, password)
    const accessToken = user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    setCookies(res, accessToken, refreshToken)
    res.json(getPublicResponseForAccessToken(accessToken))
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }
})

authRouter.post('/signup', async (req, res: express.Response<Failable<AuthResponse>>) => {
  const { firstName, middleName, lastName, email, password } = req.body
  try {
    const user = await User.mongo.newUser({
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
    res.json(getPublicResponseForAccessToken(accessToken))
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }
})

const refreshToken = async (
  req: express.Request,
  res: express.Response<Failable<AuthResponse>>
) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME]
  const userId = req.body.id

  if (userId == null || refreshToken == null || refreshToken.trim() === '') {
    return res.status(401).end()
  }

  const user = await User.mongo.findById(MUUID.from(userId))
  if (user == null) {
    return res.status(401).end()
  }

  // Check if the specified refresh token exists and belongs to this user
  const isTokenValid = await Token.mongo.verify(refreshToken, user._id)
  if (!isTokenValid) {
    return res.status(401).json({
      message: 'Invalid refresh token',
    })
  }

  const accessToken = user.generateAccessToken()
  setCookies(res, accessToken)
  res.json(getPublicResponseForAccessToken(accessToken))
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
