import sgMail from '@sendgrid/mail'
import { SENDGRID_TOKEN } from 'src/config'
import { DocumentType } from '@typegoose/typegoose'
import { User } from 'src/models/User'
import axios from 'axios'

sgMail.setApiKey(SENDGRID_TOKEN)

export enum SendgridTemplate {
  VerifyEmail = 'd-02455eda777b41f980776fa13d043b81',
  ResetPassword = 'd-164c0ae3e9e04667ac541bc5d816a6ed',
  NomusProPaymentFailed = 'd-11abe1c5156e47118e37594b5690d6d5',
  ManualSubmission = 'd-d86031423de4478b987c028ccbec962c',
}

export enum SendgridList {
  CurrentUsers = 'bf9292dd-b2b3-4da3-9512-f2e15be3c8a2',
}

export async function addUserToMailContactsList(user: DocumentType<User>): Promise<void> {
  const options = {
    // eslint-disable-next-line camelcase
    list_ids: [SendgridList.CurrentUsers],
    // eslint-disable-next-line camelcase
    contacts: [{ email: user.email, first_name: user.name.first, last_name: user.name.last }],
  }
  await axios.post('api.sendgrid.com/v3/marketing/contacts', options, {
    headers: {
      authorization: `Bearer ${process.env.SENDGRID_TOKEN}`,
      'content-type': 'application/json',
    },
  })
}

export { sgMail }
