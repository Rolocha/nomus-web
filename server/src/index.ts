// Necessary for type-graphql and typegoose
import 'reflect-metadata'

import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import * as db from 'src/db'
import authRouter, { authMiddleware } from 'src/auth'
import { server as gqlServer } from 'src/graphql'
import { appServerPort, graphqlPath } from 'src/config'
// import { graphqlUploadExpress } from 'graphql-upload'

db.init()

const cookieMiddleware = cookieParser()
const app = express()
app.use(morgan(':date[clf] | :method :url :status - :response-time ms'))

app.get('/ping', async (req: Request, res: Response) => {
  res.send('pong')
})

// Set up public auth routes
app.use('/auth', cookieMiddleware, bodyParser.json(), authRouter)

// Set up GraphQL
app.use(graphqlPath, cookieMiddleware, authMiddleware)
gqlServer.applyMiddleware({ app, path: graphqlPath })

app.listen(Number(appServerPort), () => {
  console.log(`⚡️ Express server is running on localhost:${appServerPort}`)
})
