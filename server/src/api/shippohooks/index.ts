import * as Sentry from '@sentry/node'
import express from 'express'
import handleShippoTrackUpdate from './handle-shippo-track-updated'

export enum ShippohookScenario {
  TrackUpdated,
}

type ShippohookHandler = (message: any) => Promise<any>

export const shippohookHandlers: Record<ShippohookScenario, ShippohookHandler> = {
  [ShippohookScenario.TrackUpdated]: handleShippoTrackUpdate,
}

export const shippoWebhooksRouter = express.Router()

const determineShippohookScenario = (message: any): ShippohookScenario | null => {
  switch (message.event) {
    case 'track_updated': {
      return ShippohookScenario.TrackUpdated
    }
    default:
      return null
  }
}

shippoWebhooksRouter.post('/', express.json(), async (req, res) => {
  let message = req.body
  const ShippohookScenario = determineShippohookScenario(message)
  if (ShippohookScenario == null) {
    console.log(
      `Received Shippo webhook for a message type (${message.type}) we don't need: ${message.id}`
    )
    return res.status(200).send()
  }

  const handler = shippohookHandlers[ShippohookScenario]
  try {
    await handler(message)
  } catch (err) {
    Sentry.captureException(err)
  }

  return res.status(200).send()
})
