import { User } from 'src/models'
import DeletedObject from 'src/models/DeletedObject'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('delete', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  it('deletes an object and creates a DeletedObject record', async () => {
    const user = await createMockUser()
    await User.delete(user.id)
    const userRes = await User.mongo.findById(user.id)
    const deletedRes = await DeletedObject.mongo.findById(user.id)

    expect(userRes).toBe(null)
    expect(deletedRes.id).toBe(user.id)
    const { createdAt, updatedAt, ...parsed } = JSON.parse(deletedRes.deletedObject)
    const { createdAt: userCreated, updatedAt: userUpdated, ...userParsed } = user.toJSON()
    expect(parsed).toMatchObject(userParsed)
    expect(new Date(createdAt)).toStrictEqual(userCreated)
    expect(new Date(updatedAt)).toStrictEqual(userUpdated)
  })

  it('throws an error if the id does not exist', async () => {
    const res = await User.delete('user_6019de0946d7d600243071ed')
    expect(res.isSuccess).toBeFalsy()
    expect(res.error.name).toBe('id-not-found')
  })
})
describe('batchDelete', () => {
  it('deletes a list of ids as a batch', async () => {
    const user1 = await createMockUser()
    const user2 = await createMockUser()
    const user3 = await createMockUser()

    const users = [user1, user2, user3]

    const res = await User.batchDelete(users.map((u) => u.id))

    const userRes = await User.mongo.find()
    const deletedRes = await DeletedObject.mongo.find()

    expect(res.isSuccess).toBeTruthy()
    expect(userRes).toEqual([])
    expect(deletedRes.length).toBe(users.length)

    users.sort((a, b) => (a.id > b.id ? 1 : -1))
    deletedRes.sort((a, b) => (a.id > b.id ? 1 : -1))

    deletedRes.forEach((model, index) => {
      const { createdAt, updatedAt, ...parsed } = JSON.parse(model.deletedObject)
      const { createdAt: userCreated, updatedAt: userUpdated, ...userParsed } = users[
        index
      ].toJSON()
      expect(parsed).toMatchObject(userParsed)
      expect(new Date(createdAt)).toStrictEqual(userCreated)
      expect(new Date(updatedAt)).toStrictEqual(userUpdated)
    })
  })

  it('fails if an id in the list does not exist', async () => {
    const res = await User.batchDelete(['user_6019de0946d7d600243071ed'])
    expect(res.isSuccess).toBeFalsy()
    expect(res.error.name).toBe('id-not-found')
  })

  it('fails when models are mixed and matched', async () => {
    const user = await createMockUser()
    const cardVersion = await createMockCardVersion()

    const models = [user, cardVersion]

    const res = await User.batchDelete(models.map((u) => u.id))

    expect(res.isSuccess).toBeFalsy()
    expect(res.error.name).toBe('id-not-found')
  })
})
