import sgMail from '@sendgrid/mail'
import { SENDGRID_TOKEN } from 'src/config'

sgMail.setApiKey(SENDGRID_TOKEN)

export enum SendgridTemplate {
  VerifyEmail = 'd-02455eda777b41f980776fa13d043b81',
  ResetPassword = 'd-164c0ae3e9e04667ac541bc5d816a6ed',
  NomusProPaymentFailed = 'd-11abe1c5156e47118e37594b5690d6d5',
  ManualSubmission = 'd-d86031423de4478b987c028ccbec962c',
}

export { sgMail }
