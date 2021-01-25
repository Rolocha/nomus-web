import sgMail from '@sendgrid/mail'
import { SENDGRID_TOKEN } from 'src/config'

sgMail.setApiKey(SENDGRID_TOKEN)

export enum SendgridTemplate {
  VerifyEmail = 'd-02455eda777b41f980776fa13d043b81',
  ResetPassword = 'd-164c0ae3e9e04667ac541bc5d816a6ed',
}

export { sgMail }
