import { User } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { createMockUser } from 'src/__mocks__/models/User'
import phoneNumberE164FormatMigration from './2021-06-15-phone-number-e164-format'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('phoneNumberE164Format', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  it('migrates user profile information to a new UserProfile object', async () => {
    const user = await createMockUser({
      profilePicS3Key: 's3key',
      phoneNumber: '1234567890',
      email: 'foo@bar.com',
    })
    await user.save()

    await phoneNumberE164FormatMigration.execute()

    const migratedUser = await User.mongo.findById(user.id)
    expect(migratedUser.phoneNumber).toBe('+1' + user.phoneNumber)
  })
})
