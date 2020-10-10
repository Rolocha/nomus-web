import * as fs from 'fs'
import * as express from 'express'
import { User } from 'src/models'
import vCards from 'vcards-js'
import { saveVCFToFile } from 'src/util/vcf'

const apiRouter = express.Router()

apiRouter.get('/contact-card/:username', async (req: express.Request, res: express.Response) => {
  const username = req.params.username
  const meetingDate = req.query.meetingDate ? new Date(req.query.meetingDate as string) : null
  const meetingPlace = req.query.meetingPlace as string
  const tags = req.query.tags as string
  const additionalNotes = req.query.additionalNotes as string

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
    additionalNotes ? `Additional notes: ${additionalNotes}` : null,
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

export default apiRouter
