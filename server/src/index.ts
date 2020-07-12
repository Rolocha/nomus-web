// Necessary for type-graphql and typegoose
import 'reflect-metadata'

import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import * as db from 'src/db'
import authRouter, { authMiddleware } from 'src/auth'
import sendgridRouter from 'src/sendgrid'
import { server as gqlServer } from 'src/graphql'
import { appServerPort, graphqlPath } from 'src/config'

db.init()

const app = express()
app.use(cookieParser())
app.use(morgan(':date[clf] | :method :url :status - :response-time ms'))

app.get('/ping', async (req: Request, res: Response) => {
  res.send('pong')
})

app.use('/auth', bodyParser.json(), authRouter)
app.use(graphqlPath, authMiddleware)
app.use('/api/sendgrid', bodyParser.json(), sendgridRouter)
gqlServer.applyMiddleware({ app, path: graphqlPath })

app.listen(Number(appServerPort), () => {
  console.log(`⚡️ Express server is running on localhost:${appServerPort}`)
})
