import * as express from 'express'
import User from 'src/models/User'

export interface IApolloContext {
  user?: User
  req: express.Request
}
