import { User } from 'src/models'
import DeletedObject from 'src/models/DeletedObject'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { deleteObject } from 'src/util/deleteObject'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('deleteObject', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  it('deletes an object and creates a DeletedObject record', async () => {
    const user = await createMockUser()
    deleteObject(user)
    const userRes = await User.mongo.findById(user.id)
    const deletedRes = await DeletedObject.mongo.findById(user.id)

    expect(userRes).toBe(null)
    expect(deletedRes.id).toBe(user.id)
  })
})
