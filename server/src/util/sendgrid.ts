import sgMail from '@sendgrid/mail'
import { SENDGRID_TOKEN } from 'src/config'

sgMail.setApiKey(SENDGRID_TOKEN)

export enum SendgridTemplate {
  VerifyEmail = 'd-02455eda777b41f980776fa13d043b81',
  ResetPassword = 'd-164c0ae3e9e04667ac541bc5d816a6ed',

  // id's for templates related to the Order State Machine
  OrderPaid = 'd-39e1e9e155d646398fc05d8d17de3676',
  OrderEnroute = 'd-b010e699be9e4290876c261499cec44e',
  OrderFulfilled = 'd-7f3e66ccea434ca5a10ef9e4e614b367',
}

export { sgMail }
