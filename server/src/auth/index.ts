import * as express from 'express'
import jwt from 'jsonwebtoken'
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_LIFESPAN,
  MINIMUM_PASSWORD_STRENGTH,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_LIFESPAN,
} from 'src/config'
import { RefreshToken, User } from 'src/models'
import { Role } from 'src/util/enums'
import zxcvbn from 'zxcvbn'
import { TokenBody } from './types'
import { getUserFromToken } from './util'

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

interface SetAuthCookiesOptions {
  omitRefreshToken?: boolean
}

export const setAuthCookies = async (
  user: User,
  res: express.Response,
  options: SetAuthCookiesOptions = {}
) => {
  const accessToken = user.generateAccessToken()
  const refreshToken = options.omitRefreshToken ? null : await user.generateRefreshToken()

  // TODO: Add secure: true once we have HTTPS set up
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    maxAge: ACCESS_TOKEN_LIFESPAN,
  })
  if (!options.omitRefreshToken && refreshToken) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
      maxAge: REFRESH_TOKEN_LIFESPAN,
    })
  }
  return { accessToken, refreshToken }
}

const getAuthDataForAccessToken = (accessToken: string) => {
  const accessTokenBody = jwt.decode(accessToken) as TokenBody
  return {
    tokenExp: accessTokenBody.exp,
    roles: accessTokenBody.roles,
    id: accessTokenBody._id,
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
    const { accessToken } = await setAuthCookies(user, res)
    res.json({ data: getAuthDataForAccessToken(accessToken) })
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }
})

authRouter.post('/signup', async (req, res: express.Response<AuthResponse>) => {
  const { firstName, middleName, lastName, email, password } = req.body

  // Verify password strength
  if (zxcvbn(password).score < MINIMUM_PASSWORD_STRENGTH) {
    return res.status(400).json({
      error: {
        code: 'password-too-weak',
      },
    })
  }

  try {
    const createUserResult = await User.mongo.createNewUser({
      name: {
        first: firstName,
        middle: middleName,
        last: lastName,
      },
      email,
      password,
    })

    if (!createUserResult.isSuccess) {
      switch (createUserResult.error.name) {
        case 'empty-username':
        case 'non-unique-username':
        case 'non-unique-email':
        case 'reserved-route':
          return res.status(400).json({ error: { code: createUserResult.error.name } })
        case 'unknown-error':
          return res.status(500).json({ error: { code: createUserResult.error.name } })
      }
    }
    const user = createUserResult.value
    const { accessToken } = await setAuthCookies(user, res)
    res
      .status(201)
      .json({ data: getAuthDataForAccessToken(accessToken) })
      .end()

    // Send the verification email, but don't await as it's not the end of the world if it fails, user can request again
    user.sendVerificationEmail()
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
  RefreshToken.mongo.invalidate(req.cookies[REFRESH_TOKEN_COOKIE_NAME])
  res.end()
})

const refreshToken = async (req: express.Request, res: express.Response<AuthResponse>) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME]
  const userId = req.body.id

  if (userId == null) {
    return res.status(401).json({
      error: {
        code: 'missing-user-id',
      },
    })
  }
  if (refreshToken == null || refreshToken.trim() === '') {
    return res.status(401).json({
      error: {
        code: 'missing-refresh-token',
      },
    })
  }

  const user = await User.mongo.findById(userId)
  if (user == null) {
    return res.status(401).json({
      error: {
        code: 'no-user-with-that-id',
        message: `No user found for the userId ${userId}`,
      },
    })
  }

  // Check if the specified refresh token exists and belongs to this user
  const isTokenValid = await RefreshToken.mongo.verify(refreshToken, user._id)
  if (!isTokenValid) {
    return res.status(401).json({
      error: {
        code: 'invalid-refresh-token',
        message: 'Invalid refresh token',
      },
    })
  }

  const accessToken = user.generateAccessToken()
  setAuthCookies(user, res, {
    omitRefreshToken: true,
  })
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

authRouter.get('/verify', async (req, res) => {
  const { token, email } = req.query

  if (email == null || token == null || typeof email !== 'string' || typeof token !== 'string') {
    return res.status(400).json({
      message: 'Invalid verification link',
    })
  }

  const user = await User.mongo.findOne({ email })
  if (user == null) {
    return res.status(400).json({
      message: 'No user with that email',
    })
  }

  const verificationResult = await user.verifyEmail(token)

  switch (verificationResult) {
    case 'already-verified': {
      return res.redirect('/dashboard/settings')
    }
    case 'success': {
      return res.redirect('/dashboard/settings?justVerifiedEmail')
    }
    case 'invalid': {
      return res.status(400).json({
        message: 'Invalid verification link',
      })
    }
    case 'expired': {
      return res.status(400).json({
        message: 'Expired verification token',
      })
    }
  }
})

// Include the auth middleware here since we need the user object to send an email
authRouter.get('/resend-verification-email', authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Not logged in as any user',
    })
  }
  await req.user.sendVerificationEmail()
  res.status(200).end()
})

export default authRouter
