import { RESERVED_ROUTES } from 'src/config'
import validateUsername from 'src/models/validation/validateUsername'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('model validators', () => {
  describe('validateUsername', () => {
    afterEach(async () => {
      await dropAllCollections()
    })
    it('errors for a username collision', async () => {
      await createMockUser({ username: 'roxmysox' })
      expect((await validateUsername('roxmysox')).error.name).toBe('non-unique-username')
    })

    it('errors if using a reserved route', async () => {
      expect((await validateUsername(RESERVED_ROUTES[0])).error.name).toBe('reserved-route')
    })

    it('does not error for unique username', async () => {
      await createMockUser({ username: 'roxmysox' })
      expect((await validateUsername('roxmysox2')).isSuccess).toBe(true)
    })
  })
})
