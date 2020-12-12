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
import { appServerPort, graphqlPath } from 'src/config'
import { getUserFromCardId, spliceRouteStr } from './util/linker'
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

app.use('/api', cookieMiddleware, bodyParser.json(), apiRouter)

app.get('/d/:routeStr', async (req, res) => {
  const routeStr = req.params.routeStr
  const routeStrResult = spliceRouteStr(routeStr)
  if (!routeStrResult.isSuccess) {
    res.redirect(404, '404')
    return
  }
  const { cardId } = routeStrResult.getValue()
  const user = await getUserFromCardId(cardId)
  if (user) {
    res.redirect(307, `/${user.username}`)
  } else {
    res.redirect(302, `/admin/linker/${routeStr}`)
  }
})

app.listen(Number(appServerPort), () => {
  console.log(`⚡️ Express server is running on localhost:${appServerPort}`)
})
