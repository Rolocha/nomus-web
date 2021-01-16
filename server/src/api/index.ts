import * as express from 'express'

import { contactRouter } from './contact'
import { sendgridRouter } from './sendgrid'

const apiRouter = express.Router()

apiRouter.use('/sendgrid', sendgridRouter)
apiRouter.use('/contact', contactRouter)

export default apiRouter
