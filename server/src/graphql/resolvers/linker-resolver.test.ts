import { Card, Sheet } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { OrderState, Role } from 'src/util/enums'
import { createMockCard } from 'src/__mocks__/models/Card'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockSheet } from 'src/__mocks__/models/Sheet'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('LinkerResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('linkSheetToUser', () => {
    it('takes in a routeStr and shortId then links the cards to a user', async () => {
      const user = await createMockUser()
      const userVendor = await createMockUser({ roles: [Role.User, Role.PrintTech] })
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

      const response = await execQuery({
        source: `
          mutation LinkSheetToUserMutation($routeStr: String!, $shortId: String!) {
            linkSheetToUser(routeStr: $routeStr, shortId: $shortId) {
              userId
              sheetId
            }
          }
        `,
        variableValues: {
          routeStr: routeStr,
          shortId: order.shortId,
        },
        contextUser: userVendor,
      })

      expect(response.data?.linkSheetToUser).toMatchObject({ userId: user.id, sheetId: sheet.id })

      const resSheet = await Sheet.mongo.findById(sheet.id)
      const resCard = await Card.mongo.findById(card.id)

      expect(resSheet.cardVersion).toBe(cardVersion.id)
      expect(resCard.user).toBe(user.id)
    })
  })
  describe('unlinkSheet', () => {
    it('unlinks a sheet', async () => {
      const user = await createMockUser()
      const userAdmin = await createMockUser({ roles: [Role.User, Role.Admin] })
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

      const response = await execQuery({
        source: `
          mutation unlinkSheetMutation($sheetId: String!) {
            unlinkSheet(sheetId: $sheetId)
          }
        `,
        variableValues: {
          sheetId: sheet.id,
        },
        contextUser: userAdmin,
      })
      expect(response.errors).toBe(undefined)
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
