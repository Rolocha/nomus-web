import { Card, Sheet } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { createMockCard } from 'src/__mocks__/models/Card'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockSheet } from 'src/__mocks__/models/Sheet'
import { createMockUser } from 'src/__mocks__/models/User'
import { CardInteractionType } from './enums'
import { NamedError } from './error'
import { getCardDataForInteractionString, linkSheetToUser } from './linker'

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

  describe('getCardDataForInteractionString', () => {
    it('fails incorrectly formatted routeStr, miss-spelled', async () => {
      const badRoute = 'sheet_jsdldnfskl-card_fsfljs'
      const result = await getCardDataForInteractionString(badRoute)
      expect(result.isSuccess).toBeFalsy()
      expect(result.error).toEqual(new NamedError(`Incorrectly formatted routeStr: ${badRoute}`))
    })

    it('fails incorrectly formatted routeStr, repeated', async () => {
      const repeatedRoute =
        'sheet_abcdefabcdefabcdef012345-card_abcdefabcdefabcdef012345-sheet_abcdefabcdefabcdef012345-card_abcdefabcdefabcdef012345'
      const result = await getCardDataForInteractionString(repeatedRoute)
      expect(result.isSuccess).toBeFalsy()
      expect(result.error).toEqual(
        new NamedError(`Incorrectly formatted routeStr: ${repeatedRoute}`)
      )
    })

    it('properly parses a tap (NFC) URL', async () => {
      const cardVersion = await createMockCardVersion()
      const card = await createMockCard({ cardVersion: cardVersion.id })
      const sheet = await createMockSheet({ cards: [card] })

      const routeStr = [sheet.id, card.id].join('-')
      const result = await getCardDataForInteractionString(routeStr)

      expect(result.value.card.id).toStrictEqual(card.id)
      expect(result.value.cardVersion.id).toStrictEqual(cardVersion.id)
      expect(result.value.interactionType).toStrictEqual(CardInteractionType.Tap)
    })

    it('properly parses a QR scan URL', async () => {
      const cardVersion = await createMockCardVersion()

      const routeStr = cardVersion.id
      const result = await getCardDataForInteractionString(routeStr)

      expect(result.value.cardVersion.id).toStrictEqual(cardVersion.id)
      expect(result.value.interactionType).toStrictEqual(CardInteractionType.QRCode)
    })
  })

  describe('linkSheetToUser', () => {
    it('links a sheet from a routeStr to a user with a shortId', async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion({
        user: user.id,
      })
      const card = await createMockCard({ user: null, cardVersion: cardVersion.id })
      const sheet = await createMockSheet({
        cardVersion: null,
        cards: [card.id],
      })
      const order = await createMockOrder({
        user: user.id,
        cardVersion: cardVersion.id,
      })

      const routeStr = sheet.id + '-' + card.id

      const ret = (await linkSheetToUser(routeStr, order.shortId)).value

      expect(ret).toMatchObject({ userId: user.id, sheetId: sheet.id })

      const resSheet = await Sheet.mongo.findById(sheet.id)
      const resCard = await Card.mongo.findById(card.id)

      expect(resSheet.cardVersion).toBe(cardVersion.id)
      expect(resCard.user).toBe(user.id)
    })

    it('tries to link a sheet but fails because there is no sheet', async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion({
        user: user.id,
      })
      const card = await createMockCard({ user: null, cardVersion: cardVersion.id })

      const order = await createMockOrder({
        user: user.id,
        cardVersion: cardVersion.id,
      })
      const sheetId = 'sheet_5f9caf60c9b90b8674941e7f'

      const routeStr = sheetId + '-' + card.id

      const ret = await linkSheetToUser(routeStr, order.shortId)

      expect(ret.isSuccess).toBe(false)
      expect(ret.error).toEqual(new NamedError('sheet-not-found'))
    })
  })
})
