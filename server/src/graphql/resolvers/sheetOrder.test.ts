import { Card, Sheet } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { Role } from 'src/util/enums'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('SheetOrderResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('createSheetOrder', () => {
    it('creates the required sheets and defaults to 25 cards per sheet', async () => {
      const adminUser = await createMockUser({ roles: [Role.User, Role.Admin] })
      const numSheets = 5

      const response = await execQuery({
        source: `
          mutation CreateSheetOrderMutation($numSheets: Float!, $numCardsInSheet: Float) {
            createSheetOrder(numSheets: $numSheets, numCardsInSheet: $numCardsInSheet) {
              orderPayload
              sheets {
                  id
              }
            }
          }
        `,
        variableValues: {
          numSheets: numSheets,
        },
        contextUser: adminUser,
      })

      expect(response.errors).toBeUndefined()
      expect(response.data.createSheetOrder.orderPayload.length).toBe(5)
      expect(response.data.createSheetOrder.orderPayload[0].length).toBe(25)
      expect(response.data.createSheetOrder.orderPayload[0][0]).toMatch(
        new RegExp('^https://nomus.me/d/sheet_.*-card_.*$')
      )

      const createdSheets = await Sheet.mongo.find({})
      expect(createdSheets.length).toBe(numSheets)
      expect(createdSheets[0].cards.length).toBe(25)

      const createdCards = await Card.mongo.find({})
      expect(createdCards.length).toBe(5 * 25)
    })
  })
})
