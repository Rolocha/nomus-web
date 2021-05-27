// Necessary for type-graphql and typegoose
import 'reflect-metadata'

import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import * as db from 'src/db'
import authRouter, { authMiddleware } from 'src/auth'
import apiRouter from 'src/api'
import { server as gqlServer } from 'src/graphql'
import { cardRouter } from './api/cardRouter'

db.init()

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

app.use('/api', cookieMiddleware, bodyParser.json(), apiRouter)

app.use('/d', cookieMiddleware, bodyParser.json(), cardRouter)
