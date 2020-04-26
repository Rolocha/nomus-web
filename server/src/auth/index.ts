import * as express from 'express'

import { User, Token } from 'src/models'
import { getUserFromToken } from './util'

const authRouter = express.Router()

interface ServerErrorResponse {
  message: string
}

type Failable<T> = T | ServerErrorResponse

interface AuthResponse {
  accessToken: string
  refreshToken: string
}

authRouter.post('/login', async (req, res: express.Response<Failable<AuthResponse>>) => {
  const { email, password } = req.body
  try {
    const user = await User.mongo.findByCredentials(email, password)
    const accessToken = user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    res.json({
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }
})

authRouter.post('/signup', async (req, res: express.Response<Failable<AuthResponse>>) => {
  const { firstName, middleName, lastName, email, password } = req.body
  try {
    const user = await User.mongo.create({
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
    res.json({
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }
})

authRouter.post(
  '/refresh',
  async (req, res: express.Response<Failable<{ accessToken: string }>>) => {
    const { refreshToken } = req.body

    // Find the user from the token
    const authHeader = req.header('Authorization')
    if (authHeader == null || authHeader.trim() === '' || !authHeader.startsWith('Bearer ')) {
      res.status(401).end()
      return
    }
    const token = authHeader.replace(/^Bearer /, '')
    // Ignoring expiration here because we expect it to be expired -- that's why they're refreshing
    const userResult = await getUserFromToken(token, { ignoreExpiration: true })
    if (!userResult.isSuccess) {
      res.status(500).end()
      return
    }
    const user = userResult.getValue()

    let tokenObject: Token
    try {
      // Verify there exists a valid refresh token for this user matching the one they just sent
      tokenObject = await Token.mongo.findOne({ value: refreshToken, client: user._id })
      if (!tokenObject.isValid()) {
        throw new Error()
      }
    } catch (err) {
      res.status(400).json({
        message: 'Invalid refresh token',
      })
    }

    const accessToken = user.generateAccessToken()
    res.json({ accessToken })
  }
)

export default authRouter
