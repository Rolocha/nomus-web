import MUUID from 'uuid-mongodb'

import { initDB, cleanUpDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('UserResolver', () => {
  describe('getUser', () => {
    it('when the userId is provided and context.user is an admin, gets the requested user', async () => {
      const user = await createMockUser()
      const userId = MUUID.from(user._id).toString()
      const { data } = await execQuery({
        source: `
          query GetUserTestQuery($userId: String) {
            user(userId: $userId) {
              _id
              email
            }
          }
        `,
        variableValues: {
          userId,
        },
        asAdmin: true,
      })
      expect(data?.user?._id).toBe(user.id)
      expect(data?.user?.email).toBe(user.email)
    })
  })
})
