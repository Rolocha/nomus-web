import { Card, Sheet, SheetOrder } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { Role, SheetState } from 'src/util/enums'
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

  describe('transitionSheetOrderState', () => {
    const createSheetOrder = async (numSheets, user): Promise<SheetOrder> => {
      const creationResponse = await execQuery({
        source: `
          mutation CreateSheetOrderMutation($numSheets: Float!, $numCardsInSheet: Float) {
            createSheetOrder(numSheets: $numSheets, numCardsInSheet: $numCardsInSheet) {
              id
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
        contextUser: user,
      })

      expect(creationResponse.errors).toBeUndefined()
      return creationResponse.data.createSheetOrder
    }
    it('updates the state of all sheets in the order to Received', async () => {
      const adminUser = await createMockUser({ roles: [Role.User, Role.Admin] })
      const numSheets = 5

      // Create the sheet order first
      const sheetOrder = await createSheetOrder(numSheets, adminUser)

      // Then transition it
      const transitionResponse = await execQuery({
        source: `
          mutation TestMutation($sheetOrderId: String!, $futureState: SheetState!) {
            transitionSheetOrderState(sheetOrderId: $sheetOrderId, futureState: $futureState) {
              sheets {
                state
              }
            }
          }
        `,
        variableValues: {
          sheetOrderId: sheetOrder.id,
          futureState: SheetState.Received,
        },
        contextUser: adminUser,
      })

      expect(transitionResponse.errors).toBeUndefined()
      expect(
        transitionResponse.data.transitionSheetOrderState.sheets.every(
          (s: Sheet) => s.state === SheetState.Received
        )
      ).toBe(true)
    })

    it("does not update the state for sheets that aren't the one specified", async () => {
      const adminUser = await createMockUser({ roles: [Role.User, Role.Admin] })
      const numSheets = 5

      // Create two separate sheet orders
      const sheetOrderA = await createSheetOrder(numSheets, adminUser)
      const sheetOrderB = await createSheetOrder(numSheets, adminUser)

      // Then transition the sheets from creation request A
      const transitionResponse = await execQuery({
        source: `
          mutation TestMutation($sheetOrderId: String!, $futureState: SheetState!) {
            transitionSheetOrderState(sheetOrderId: $sheetOrderId, futureState: $futureState) {
              sheets {
                state
              }
            }
          }
        `,
        variableValues: {
          sheetOrderId: sheetOrderA.id,
          futureState: SheetState.Received,
        },
        contextUser: adminUser,
      })

      expect(transitionResponse.errors).toBeUndefined()

      // and verify that the sheets in SheetOrder B are still on the Created state
      const sheetsInOrderB = (await SheetOrder.mongo.findById(sheetOrderB.id).populate('sheets'))
        .sheets as Sheet[]
      expect(sheetsInOrderB.every((s) => s.state === SheetState.Created)).toBe(true)
    })
  })
})
