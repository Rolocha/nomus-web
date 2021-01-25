import Stripe from 'stripe'
import { STRIPE_TOKEN } from 'src/config'

export const stripe = new Stripe(STRIPE_TOKEN, {
  apiVersion: '2020-03-02',
})

export { Stripe }
