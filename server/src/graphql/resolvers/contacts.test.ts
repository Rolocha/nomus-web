import { initDB, cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockUser } from 'src/__mocks__/models/User'
import { createMockConnection } from 'src/__mocks__/models/Connection'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('ContactsResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('connection', () => {
    it("gets a user's connections", async () => {
      const user_from = await createMockUser()
      const user_to = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })
      await user_from.save()
      await user_to.save()
      const connection = await createMockConnection(user_from, user_to)
      await connection.save()

      const response = await execQuery({
        source: `
        query ContactsTestQuery {
          contacts {
            notes
          }
        }
        `,
        contextUser: user_from,
      })

      const expectedResponse = [{ notes: 'Notes!' }]

      expect(response).toBe(response)
    })
  })
})
