import { Card, Order, Sheet } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { createMockCard } from 'src/__mocks__/models/Card'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockSheet } from 'src/__mocks__/models/Sheet'
import { createMockUser } from 'src/__mocks__/models/User'
import { CardInteractionType, OrderState } from './enums'
import { NamedError } from './error'
import { getCardDataForInteractionString, linkSheetToUser, unlinkSheet } from './linker'

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

  describe('cardRouter', () => {
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

    it('properly parses a linked tap (NFC) URL', async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion({ user: user.id })
      const card = await createMockCard({ cardVersion: cardVersion.id, user: user.id })
      const sheet = await createMockSheet({ cards: [card] })

      const routeStr = [sheet.id, card.id].join('-')
      const result = await getCardDataForInteractionString(routeStr)

      expect(result.value.card.id).toStrictEqual(card.id)
      expect(result.value.cardVersion.id).toStrictEqual(cardVersion.id)
      expect(result.value.interactionType).toStrictEqual(CardInteractionType.Tap)
      expect(result.value.cardUser.username).toStrictEqual(user.username)
    })

    it('properly parses an un-linked tap (NFC) URL', async () => {
      const card = await createMockCard({ cardVersion: null, user: null })
      const sheet = await createMockSheet({ cards: [card] })

      const routeStr = [sheet.id, card.id].join('-')
      const result = await getCardDataForInteractionString(routeStr)

      expect(result.value.card.id).toStrictEqual(card.id)
      expect(result.value.cardVersion).toStrictEqual(null)
      expect(result.value.interactionType).toStrictEqual(CardInteractionType.Tap)
      expect(result.value.cardUser).toStrictEqual(null)
    })

    it('properly parses a QR scan URL with an userId', async () => {
      const user = await createMockUser()

      const routeStr = user.id
      const result = await getCardDataForInteractionString(routeStr)

      expect(result.value.card).toStrictEqual(null)
      expect(result.value.cardVersion).toStrictEqual(null)
      expect(result.value.interactionType).toStrictEqual(CardInteractionType.QRCode)
      expect(result.value.cardUser.username).toStrictEqual(user.username)
    })
  })

  describe('linkSheetToUser', () => {
    it('links a sheet from a routeStr to a user with a shortId, one sheet', async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion({
        user: user.id,
      })
      const card = await createMockCard({ user: null, cardVersion: null })
      const sheet = await createMockSheet({
        cardVersion: null,
        cards: [card.id],
      })
      const order = await createMockOrder({
        user: user.id,
        cardVersion: cardVersion.id,
        state: OrderState.Creating,
        quantity: 1,
      })

      const routeStr = sheet.id + '-' + card.id

      const ret = (await linkSheetToUser(routeStr, order.shortId)).value

      expect(ret).toMatchObject({ userId: user.id, sheetId: sheet.id })

      const resSheet = await Sheet.mongo.findById(sheet.id)
      const resCard = await Card.mongo.findById(card.id)
      const resOrder = await Order.mongo.findById(order.id)

      expect(resSheet.cardVersion).toBe(cardVersion.id)
      expect(resSheet.order).toBe(order.id)
      expect(resCard.user).toBe(user.id)
      expect(resCard.cardVersion).toBe(cardVersion.id)
      expect(resOrder.state).toBe(OrderState.Created)
    })

    it('links multiple sheets in one order', async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion({
        user: user.id,
      })
      const card1 = await createMockCard({ user: null, cardVersion: null })
      const sheet1 = await createMockSheet({
        cardVersion: null,
        cards: [card1.id],
      })
      const card2 = await createMockCard({ user: null, cardVersion: null })
      const card3 = await createMockCard({ user: null, cardVersion: null })
      const sheet2 = await createMockSheet({
        cardVersion: null,
        cards: [card2.id, card3.id],
      })
      const order = await createMockOrder({
        user: user.id,
        cardVersion: cardVersion.id,
        state: OrderState.Creating,
        quantity: 3,
      })

      const routeStr = sheet1.id + '-' + card1.id

      const ret = (await linkSheetToUser(routeStr, order.shortId)).value

      expect(ret).toMatchObject({ userId: user.id, sheetId: sheet1.id })

      const resSheet = await Sheet.mongo.findById(sheet1.id)
      const resCard = await Card.mongo.findById(card1.id)
      const resOrder = await Order.mongo.findById(order.id)

      expect(resSheet.cardVersion).toBe(cardVersion.id)
      expect(resSheet.order).toBe(order.id)
      expect(resCard.user).toBe(user.id)
      expect(resCard.cardVersion).toBe(cardVersion.id)
      expect(resOrder.state).toBe(OrderState.Creating)

      const routeStr2 = sheet2.id + '-' + card2.id

      const ret2 = (await linkSheetToUser(routeStr2, order.shortId)).value

      expect(ret2).toMatchObject({ userId: user.id, sheetId: sheet2.id })

      const resSheet2 = await Sheet.mongo.findById(sheet2.id)
      const resCard2 = await Card.mongo.findById(card2.id)
      const resCard3 = await Card.mongo.findById(card3.id)
      const resOrder2 = await Order.mongo.findById(order.id)

      expect(resSheet2.cardVersion).toBe(cardVersion.id)
      expect(resSheet2.order).toBe(order.id)
      expect(resCard2.user).toBe(user.id)
      expect(resCard2.cardVersion).toBe(cardVersion.id)
      expect(resCard3.user).toBe(user.id)
      expect(resCard3.cardVersion).toBe(cardVersion.id)
      expect(resOrder2.state).toBe(OrderState.Created)
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
  describe('unlinkSheet', () => {
    it('tries to unlink a sheet but fails because there is no sheet', async () => {
      const sheetId = 'sheet_5f9caf60c9b90b8674941e7f'
      const ret = await unlinkSheet(sheetId)

      expect(ret.isSuccess).toBe(false)
      expect(ret.error).toEqual(new NamedError('sheet-not-found'))
    })
    it('links a sheet then unlinks it', async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion({
        user: user.id,
      })
      const order = await createMockOrder({
        user: user.id,
        cardVersion: cardVersion.id,
        state: OrderState.Creating,
        quantity: 5,
      })
      const card1 = await createMockCard({ user: user.id, cardVersion: cardVersion.id })
      const card2 = await createMockCard({ user: user.id, cardVersion: cardVersion.id })
      const card3 = await createMockCard({ user: user.id, cardVersion: cardVersion.id })
      const card4 = await createMockCard({ user: user.id, cardVersion: cardVersion.id })
      const card5 = await createMockCard({ user: user.id, cardVersion: cardVersion.id })
      const sheet = await createMockSheet({
        cardVersion: cardVersion.id,
        order: order.id,
        cards: [card1.id, card2.id, card3.id, card4.id, card5.id],
      })
      const ret = await unlinkSheet(sheet.id)

      expect(ret.isSuccess).toBe(true)

      const sheetRes = await Sheet.mongo.find({ _id: sheet.id })
      expect(sheetRes).toEqual([
        expect.objectContaining({
          cardVersion: null,
          order: null,
        }),
      ])

      const cardRes = await Card.mongo
        .find()
        .where('_id')
        .in([card1.id, card2.id, card3.id, card4.id, card5.id])
        .exec()
      expect(cardRes).toEqual([
        expect.objectContaining({
          user: null,
          cardVersion: null,
        }),
        expect.objectContaining({
          user: null,
          cardVersion: null,
        }),
        expect.objectContaining({
          user: null,
          cardVersion: null,
        }),
        expect.objectContaining({
          user: null,
          cardVersion: null,
        }),
        expect.objectContaining({
          user: null,
          cardVersion: null,
        }),
      ])
    })
  })
})
