import sgMail from '@sendgrid/mail'
import { sendgridToken } from 'src/config'

sgMail.setApiKey(sendgridToken)

export { sgMail }
