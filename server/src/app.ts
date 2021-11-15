// Necessary for type-graphql and typegoose
import 'reflect-metadata'

import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import * as db from 'src/db'
import { setUpSentry } from 'src/util/sentry'
import authRouter, { authMiddleware } from 'src/auth'
import { server as gqlServer } from 'src/graphql'
import { cardRouter } from './api/cardRouter'

import { contactRouter } from './api/contact'
import { sendgridRouter } from './api/sendgrid'
import { stripeWebhooksRouter } from './api/stripehooks'

db.init()
setUpSentry()

const cookieMiddleware = cookieParser()
export const app = express()
app.use(morgan(':date[clf] | :method :url :status - :response-time ms'))

app.get('/ping', async (req: Request, res: Response) => {
  res.send('pong')
})

// Set up public auth routes
app.use('/auth', cookieMiddleware, bodyParser.json(), authRouter)

// Set up GraphQL
app.use('/graphql', bodyParser.json({ limit: '2mb' }), cookieMiddleware, authMiddleware)
gqlServer.applyMiddleware({ app, path: '/graphql' })

app.use('/api/sendgrid', cookieMiddleware, bodyParser.json(), sendgridRouter)
app.use('/api/contact', cookieMiddleware, bodyParser.json(), contactRouter)
app.use('/api/stripehooks', stripeWebhooksRouter)

app.use('/d', cookieMiddleware, bodyParser.json(), cardRouter)
