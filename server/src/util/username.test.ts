import { initDB, cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { createMockUser } from 'src/__mocks__/models/User'
import { validateUsername } from './username'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('ValidateUsername', () => {
  afterEach(async () => {
    await dropAllCollections()
  })
  describe('username exists', () => {
    it('has a username collision', async () => {
      await createMockUser({ username: 'roxmysox' })
      expect(await validateUsername('roxmysox')).toBe(false)
    })

    it('does not have a collision', async () => {
      await createMockUser({ username: 'roxmysox' })
      expect(await validateUsername('roxyoursox')).toBe(true)
    })
  })
  describe('reserved routes', () => {
    it('tries to be a reserved route', async () => {
      expect(await validateUsername('dashboard')).toBe(false)
    })
  })
})
