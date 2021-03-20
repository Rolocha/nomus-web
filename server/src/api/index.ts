import * as express from 'express'

import { cardRouter } from './cardRouter'
import { contactRouter } from './contact'
import { sendgridRouter } from './sendgrid'

const apiRouter = express.Router()

apiRouter.use('/sendgrid', sendgridRouter)
apiRouter.use('/contact', contactRouter)
apiRouter.use('./cardRouter', cardRouter)

export default apiRouter
