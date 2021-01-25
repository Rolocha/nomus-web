import sendgrid from '@sendgrid/client'
import express from 'express'
import { SENDGRID_TOKEN } from 'src/config'

sendgrid.setApiKey(SENDGRID_TOKEN)

export const sendgridRouter = express.Router()

sendgridRouter.post('/interest-form', async (req, res) => {
  const { email } = req.body

  if (email.trim() === '') {
    return res.status(400).json({
      message: 'Missing an email',
    })
  }

  try {
    const [response] = await sendgrid.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: {
        // Add to our pre-launch list
        // eslint-disable-next-line camelcase
        list_ids: ['3b0df4ae-aca5-4c4d-bf65-cd70eb9fba4c'],
        contacts: [{ email }],
      },
    })
    res.status(response.statusCode === 202 ? 200 : 500).end()
  } catch (err) {
    console.log(err)
    res.status(400).end()
  }
})
