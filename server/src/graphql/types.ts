import * as express from 'express'
import { DocumentType } from '@typegoose/typegoose'

import { User } from 'src/models/User'

export interface IApolloContext {
  user?: DocumentType<User>
  req?: express.Request
}
