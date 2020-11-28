import sendgrid from '@sendgrid/client'
import * as express from 'express'
import * as fs from 'fs'
import { sendgridToken } from 'src/config'
import { User } from 'src/models'
import { saveVCFToFile } from 'src/util/vcf'
import vCards from 'vcards-js'

sendgrid.setApiKey(sendgridToken)

const apiRouter = express.Router()

apiRouter.get('/contact-card/:username', async (req: express.Request, res: express.Response) => {
  const username = req.params.username
  const meetingDate = req.query.meetingDate ? new Date(req.query.meetingDate as string) : null
  const meetingPlace = req.query.meetingPlace as string
  const tags = req.query.tags as string
  const notes = req.query.notes as string

  if (username == null) {
    return res.status(400).end()
  }

  const contact = await User.mongo.findOne({ username })
  if (contact == null) {
    return res.status(400).end()
  }

  const contactPhotoUrl = await contact.getProfilePicDataUrl()
  const vCard = vCards()
  vCard.firstName = contact.name.first
  vCard.middleName = contact.name.middle
  vCard.lastName = contact.name.last
  vCard.cellPhone = contact.phoneNumber
  vCard.photo.embedFromString(contactPhotoUrl, 'image/png')
  vCard.note = [
    meetingDate != null ? `Meeting Date: ${meetingDate.toDateString()}` : null,
    meetingPlace != null ? `Meeting Place: ${meetingPlace}` : null,
    tags ? `Tags: ${tags}` : null,
    notes ? `Additional notes:\n${notes}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const fileName = `${contact.name.first}-${contact.name.last}.vcf`
  const filePath = saveVCFToFile(vCard, fileName)

  res.sendFile(filePath, (err) => {
    if (err) {
      console.log('Failure')
      console.log(err)
    } else {
      fs.unlinkSync(filePath)
    }
  })
})

apiRouter.post('/sendgrid/interest-form', async (req, res) => {
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

export default apiRouter
