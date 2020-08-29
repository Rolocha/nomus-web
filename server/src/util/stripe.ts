import Stripe from 'stripe'
import { stripeToken } from 'src/config'

export const stripe = new Stripe(stripeToken, {
  apiVersion: '2020-03-02',
})

export { Stripe }
