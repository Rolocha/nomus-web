import * as fs from 'fs'
import express from 'express'
import { Connection, User } from 'src/models'
import { saveVCFToFile } from 'src/util/vcf'
import vCards from 'vcards-js'
import { authMiddleware } from 'src/auth'

export const contactRouter = express.Router()

const getConnection = async (req: express.Request): Promise<Connection | null> => {
  if (!req.user) return null

  const username = req.params.username
  const contactUser = await User.mongo.findOne({ username })
  if (contactUser == null) return null

  const connection = await Connection.mongo.findOne({
    from: req.user.id,
    to: contactUser.id,
  })

  return connection
}

contactRouter.get(
  '/vcf/:username',
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    const username = req.params.username

    const userExists = await User.mongo.exists({ username })
    if (!userExists) {
      return res.status(404).json({
        message: `No user with the username '${username}'`,
      })
    }

    const connection = await getConnection(req)

    const meetingDate = (req.query.meetingDate as string) ?? connection?.meetingDate
    const meetingPlace = (req.query.meetingPlace as string) ?? connection?.meetingPlace
    const tags = (req.query.tags as string) ?? connection?.tags.join(',')
    const notes = (req.query.notes as string) ?? connection?.notes

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
    if (contact.name.middle) vCard.middleName = contact.name.middle
    vCard.lastName = contact.name.last

    // We don't really know for certain the user's phoneNumber is a cell number
    if (contact.phoneNumber) vCard.cellPhone = contact.phoneNumber
    if (contact.email) vCard.email = contact.email
    if (contact.headline) vCard.title = contact.headline
    vCard.url = `https://nomus.me/${contact.username}`
    vCard.source = `https://nomus.me/api/contact/vcf/${contact.username}`
    if (contactPhotoUrl) vCard.photo.embedFromString(contactPhotoUrl, 'image/png')
    vCard.note = [
      meetingDate != null ? `Meeting Date: ${meetingDate}` : null,
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
  }
)
