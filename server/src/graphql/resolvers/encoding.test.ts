import { initDB, cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockUser } from 'src/__mocks__/models/User'
import { Role } from 'src/util/enums'
import { Sheet, Card } from 'src/models'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('EncodingResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('createMassSheetEncoding', () => {
    it('creates a mass sheet encoding, 5 sheets for an admin', async () => {
      const admin_user = await createMockUser({ roles: [Role.User, Role.Admin] })
      const numSheets = 5

      const response = await execQuery({
        source: `
          mutation CreateMassSheetEncodingMutation($numSheets: Float!) {
            createMassSheetEncoding(numSheets: $numSheets) {
              s3_url
            }
          }
        `,
        variableValues: {
          numSheets: numSheets,
        },
        contextUser: admin_user,
      })

      const created_sheets = await Sheet.mongo.find({})
      const created_cards = await Card.mongo.find({})
      expect(response.data?.createMassSheetEncoding?.s3_url).toBe('s3 url')
    })
  })
})
