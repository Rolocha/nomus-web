import { Card, Sheet } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { createMockCard } from 'src/__mocks__/models/Card'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockSheet } from 'src/__mocks__/models/Sheet'
import { createMockUser } from 'src/__mocks__/models/User'
import { getUserFromCardId, linkSheetToUser, spliceRouteStr } from './linker'

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

    it.only('links a sheet from a routeStr to a user with a shortId', async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion({
        user: user.id,
      })
      const card = await createMockCard({ user: null })
      const sheet = await createMockSheet({
        cardVersion: null,
        cards: [card._id],
      })
      const order = await createMockOrder({
        user: user._id,
        cardVersion: cardVersion._id,
      })

      const routeStr = sheet.id + '-' + card.id

      const ret = await linkSheetToUser(routeStr, order.shortId)

      expect(ret).toMatchObject({ userId: user.id, sheetId: sheet.id })

      const resSheet = await Sheet.mongo.findById(sheet.id)
      const resCard = await Card.mongo.findById(card.id)

      expect(resSheet.cardVersion).toBe(cardVersion.id)
      expect(resCard.user).toBe(user.id)
    })
  })
})
