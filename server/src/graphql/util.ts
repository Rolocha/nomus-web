import * as express from 'express'
import jwt from 'jsonwebtoken'
import MUUID from 'uuid-mongodb'

import User from 'src/models/User'
import { authTokenPrivateKey } from 'src/config'

interface TokenData {
  _id: string
}

export const authorizeRequest = async (req: express.Request) => {
  const authHeader = req.header('Authorization')
  if (authHeader == null) {
    throw new Error('No authorization header present on request')
  }
  const token = authHeader.replace('Bearer ', '')
  const data = jwt.verify(token, authTokenPrivateKey) as TokenData

  // TODO: Verify that token hasn't expired yet

  const user = await User.mongo.findOne({ _id: MUUID.from(data._id) })
  if (!user) {
    throw new Error('Could not find a user from the given user id')
  }
  return user
}
