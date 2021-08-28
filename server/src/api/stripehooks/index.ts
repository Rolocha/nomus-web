import bodyParser from 'body-parser'
import express from 'express'
import { STRIPE_WEBHOOK_ENDPOINT_SECRET } from 'src/config'
import { User } from 'src/models'
import { stripe } from 'src/util/stripe'
import { Stripe } from 'stripe'
import handleCardOrderCheckoutCompleted from './card-order-checkout-completed'
import handleNomusProCheckoutCompleted from './nomus-pro-checkout-completed'
import handleNomusProInvoicePaid from './nomus-pro-invoice-paid'
import handleNomusProInvoicePaymentFailed from './nomus-pro-invoice-payment-failed'

export enum StripehookScenario {
  CardOrderCheckoutCompleted,
  NomusProCheckoutCompleted,
  NomusProInvoicePaid,
  NomusProInvoicePaymentFailed,
}

type StripehookHandler = (event: any) => Promise<any>

export const stripehookHandlers: Record<StripehookScenario, StripehookHandler> = {
  [StripehookScenario.CardOrderCheckoutCompleted]: handleCardOrderCheckoutCompleted,
  [StripehookScenario.NomusProCheckoutCompleted]: handleNomusProCheckoutCompleted,
  [StripehookScenario.NomusProInvoicePaid]: handleNomusProInvoicePaid,
  [StripehookScenario.NomusProInvoicePaymentFailed]: handleNomusProInvoicePaymentFailed,
}

export const stripeWebhooksRouter = express.Router()

const determineStriphookScenario = (event: any): StripehookScenario | null => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      if (checkoutSession.mode === 'payment') {
        return StripehookScenario.CardOrderCheckoutCompleted
      } else if (checkoutSession.mode === 'subscription') {
        return StripehookScenario.NomusProCheckoutCompleted
      } else {
        return null
      }
    }
    case 'invoice.paid':
      return StripehookScenario.NomusProInvoicePaid
    case 'invoice.payment_failed':
      return StripehookScenario.NomusProInvoicePaymentFailed
  }
}

stripeWebhooksRouter.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  let event = req.body
  // Verify the webhook actually came from Stripe
  try {
    event =
      // In tests, we don't need to verify the signature so we'll need to parse
      // the Buffer into JSON ourselves
      process.env.NODE_ENV === 'test'
        ? JSON.parse(event.toString())
        : stripe.webhooks.constructEvent(
            event,
            req.headers['stripe-signature'],
            STRIPE_WEBHOOK_ENDPOINT_SECRET
          )
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message)
    return res.sendStatus(400)
  }

  const stripehookScenario = determineStriphookScenario(event)
  if (stripehookScenario == null) {
    console.log(
      `Received Stripe webhook for an event type (${event.type}) we don't need: ${event.id}`
    )
    return res.status(200).send()
  }

  const handler = stripehookHandlers[stripehookScenario]
  await handler(event)

  res.status(200).send()
})
