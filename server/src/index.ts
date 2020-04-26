// Necessary for type-graphql and typegoose
import 'reflect-metadata'

import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import * as db from 'src/db'
import authRouter from 'src/auth'
import { server as gqlServer } from 'src/graphql'

db.init()

const { APP_SERVER_PORT } = process.env

const app = express()

app.get('/ping', async (req: Request, res: Response) => {
  res.send('pong')
})

app.use('/auth', bodyParser.json(), authRouter)
gqlServer.applyMiddleware({ app, path: '/graphql' })

app.listen(Number(APP_SERVER_PORT), () => {
  console.log(`Express server is running on localhost:${APP_SERVER_PORT}`)
  console.log(`GraphQL server is running on localhost:${APP_SERVER_PORT}${gqlServer.graphqlPath}`)
})
