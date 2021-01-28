import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { createMockUser } from 'src/__mocks__/models/User'
import { User } from 'src/Models/User'
import * as validators from 'src/models/validators'
import { Result } from 'src/util/error'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('User model', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('createNewUser', () => {
    const basePayload = {
      email: 'whatever@whoever.com',
      name: {
        first: 'Whatever',
        last: 'Whee',
      },
      password: 'foobar',
    }

    describe('username validation', () => {
      it('sets a default username when none provided', async () => {
        const createUserResult = await User.mongo.createNewUser({
          ...basePayload,
        })
        expect(createUserResult.isSuccess).toBe(true)
        const user = createUserResult.value
        expect(user.username).toMatch(
          new RegExp(`^${user.name.first.toLowerCase()}-${user.name.last.toLowerCase()}`)
        )
      })

      it('fails if validateUsername fails', async () => {
        jest.spyOn(validators, 'validateUsername').mockResolvedValue(Result.fail('reserved-route'))
        const updateResult = await User.mongo.createNewUser({ ...basePayload, username: 'foobar' })
        expect(validators.validateUsername).toHaveBeenCalled()
        expect(updateResult.error.name).toBe('reserved-route')

        expect(await User.mongo.find({})).toHaveLength(0) // no user created
      })

      it('succeeds if validateUsername passes', async () => {
        jest.spyOn(validators, 'validateUsername').mockResolvedValue(Result.ok())
        const updateResult = await User.mongo.createNewUser({ ...basePayload, username: 'foobar' })
        expect(validators.validateUsername).toHaveBeenCalled()
        expect(updateResult.isSuccess).toBe(true)

        const user = await User.mongo.findOne({ username: 'foobar' })
        expect(user).not.toBeNull()
      })
    })
  })

  describe('updateUsername', () => {
    it('fails if validateUsername fails', async () => {
      const user = await createMockUser()
      jest.spyOn(validators, 'validateUsername').mockResolvedValue(Result.fail('reserved-route'))
      const updateResult = await user.updateUsername('new-one')
      expect(validators.validateUsername).toHaveBeenCalled()
      expect(updateResult.error.name).toBe('reserved-route')

      const notUpdatedUser = await User.mongo.findById(user.id)
      expect(notUpdatedUser.username).toBe(user.username)
    })

    it('succeeds if validateUsername passes', async () => {
      const user = await createMockUser()
      jest.spyOn(validators, 'validateUsername').mockResolvedValue(Result.ok())
      const updateResult = await user.updateUsername('new-one')
      expect(validators.validateUsername).toHaveBeenCalled()
      expect(updateResult.isSuccess).toBe(true)

      const updatedUser = await User.mongo.findById(user.id)
      expect(updatedUser.username).toBe('new-one')
    })
  })
})
