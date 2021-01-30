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
import { getCardDataForInteractionString } from './util/linker'
import { CardInteraction, User } from './models'
import { CardInteractionType } from './util/enums'

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
app.use('/graphql', cookieMiddleware, authMiddleware)
gqlServer.applyMiddleware({ app, path: '/graphql' })

app.use('/api', cookieMiddleware, bodyParser.json(), apiRouter)

// interactionString should take one of the following formats based on InteractionType
//   - InteractionType.Tap (NFC): sheet_x_card_y
//   - InteractionType.QRCode   : cardv_z
app.get(
  '/d/:interactionString',
  cookieMiddleware,
  bodyParser.json(),
  authMiddleware,
  async (req, res) => {
    const { interactionString } = req.params

    const cardDataResult = await getCardDataForInteractionString(interactionString)
    if (!cardDataResult.isSuccess) {
      // Failed result indicates the URL parse failed
      res.status(404).json({
        message: 'Invalid /d URL',
      })
      return
    }

    const { cardVersion, card, interactionType } = cardDataResult.value

    // Log an interaction with this card
    if (cardVersion) {
      await CardInteraction.mongo.create({
        card: card?.id, // may or may not be present
        cardVersion: cardVersion.id,
        interactionType,
      })
    }

    const cardUser = await User.mongo.findById(card.user)
    if (cardUser) {
      res.redirect(307, `/${cardUser.username}`)
    } else if (interactionType === CardInteractionType.Tap) {
      res.redirect(302, `/admin/linker/${interactionString}`)
    } else {
      res.status(400).json({
        message: `Got a non-tap (${interactionType}) interaction for a card without an associated user`,
      })
    }
  }
)
