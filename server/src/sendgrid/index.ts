import * as express from 'express'
import sendgrid from '@sendgrid/client'
import { sendgridToken } from 'src/config'

sendgrid.setApiKey(sendgridToken)

const sendgridRouter = express.Router()

sendgridRouter.post('/interest-form', async (req, res) => {
  const { email } = req.body

  if (email.trim() === '') {
    return res.status(400).json({
      message: 'Missing an email',
    })
  }

  const [response] = await sendgrid.request({
    method: 'PUT',
    url: '/v3/marketing/contacts',
    body: {
      // Add to our pre-launch list
      list_ids: ['3b0df4ae-aca5-4c4d-bf65-cd70eb9fba4c'],
      contacts: [{ email }],
    },
  })

  res.status(response.statusCode === 202 ? 200 : 500).end()
})

export default sendgridRouter
