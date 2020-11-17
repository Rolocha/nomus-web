import { Card, Sheet } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { createMockCard } from 'src/__mocks__/models/Card'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockSheet } from 'src/__mocks__/models/Sheet'
import { createMockUser } from 'src/__mocks__/models/User'
import { getCardVersionFromShortId, linkSheetToCardVersion } from './linker'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('linker', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('linking sheet to user', () => {
    it('gets the cardVersion from a shortId in an Order', async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion({
        user: user._id,
      })
      const order = await createMockOrder({
        user: user._id,
        cardVersion: cardVersion._id,
      })
      const shortId = order.shortId

      const result = await getCardVersionFromShortId(shortId)

      expect(result._id).toBe(cardVersion._id)
    })

    it('given a sheet Ref and a user Ref it links all the cards in the sheet to that User', async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion({
        user: user.id,
      })
      const card = await createMockCard({ user: null })
      const sheet = await createMockSheet({
        cardVersion: null,
        cards: [card._id],
      })

      await linkSheetToCardVersion(sheet, cardVersion)

      const createdSheets = await Sheet.mongo.findById(sheet._id)
      for (const cardId of createdSheets.cards) {
        const currcard = await Card.mongo.findById(cardId)
        expect(currcard.user).toBe(user.id)
      }
    })
  })
})
