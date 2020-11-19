import { Card, Sheet } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { createMockCard } from 'src/__mocks__/models/Card'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockSheet } from 'src/__mocks__/models/Sheet'
import { createMockUser } from 'src/__mocks__/models/User'
import {
  getCardVersionFromShortId,
  getUserFromCardId,
  linkSheetToCardVersion,
  spliceRouteStr,
} from './linker-utils'

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
    it('fails incorrectly formatted routeStr, miss-spelled', async () => {
      const badRoute = 'sheet_jsdldnfskl-card_fsfljs'
      expect(() => {
        spliceRouteStr(badRoute)
      }).toThrow(`Incorrectly formatted routeStr: ${badRoute}`)
    })

    it('fails incorrectly formatted routeStr, repeated', async () => {
      const repeatedRoute =
        'sheet_abcdefabcdefabcdef012345-card_abcdefabcdefabcdef012345-sheet_abcdefabcdefabcdef012345-card_abcdefabcdefabcdef012345'
      expect(() => {
        spliceRouteStr(repeatedRoute)
      }).toThrow(`Incorrectly formatted routeStr: ${repeatedRoute}`)
    })

    it('returns the split of a routeStr', async () => {
      const routeStr = 'sheet_abcdefabcdefabcdef012345-card_abcdefabcdefabcdef012345'
      const [esheet, ecard] = routeStr.split('-')
      expect(spliceRouteStr(routeStr)).toStrictEqual({ sheetId: esheet, cardId: ecard })
    })

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

    it("returns a non-registered card's user as null", async () => {
      const card = await createMockCard({ user: null })
      const res = await getUserFromCardId(card.id)
      expect(res).toBe(null)
    })

    it("returns a registered card's user as userId", async () => {
      const user = await createMockUser()
      const card = await createMockCard({ user })
      const res = await getUserFromCardId(card.id)
      expect(res).toBe(user.id)
    })
  })
})
