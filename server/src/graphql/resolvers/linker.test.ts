import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { Role } from 'src/util/enums'
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
      const userAdmin = await createMockUser({ roles: [Role.User, Role.Admin] })
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
        contextUser: userAdmin,
      })

      expect(response.data?.linkSheetToUser).toMatchObject({ userId: user.id, sheetId: sheet.id })
    })
  })
})
