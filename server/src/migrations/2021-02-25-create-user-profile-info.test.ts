import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { UserProfile } from 'src/models'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockUser } from 'src/__mocks__/models/User'
import createUserProfileInfoMigration from './2021-02-25-create-user-profile-info'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('createUserProfileInfoMigration', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  it('migrates user profile information to a new UserProfile object', async () => {
    const user = await createMockUser({
      profilePicS3Key: 's3key',
      phoneNumber: '1234567890',
      email: 'foo@bar.com',
    })
    const cv = await createMockCardVersion()
    user.defaultCardVersion = cv.id
    await user.save()

    await createUserProfileInfoMigration.execute()

    const userProfile = await UserProfile.mongo.findOne({ user: user.id })
    expect(userProfile).toMatchObject({
      user: user.id,
      profilePicS3Key: 's3key',
      phoneNumber: '1234567890',
      email: 'foo@bar.com',
      defaultCardVersion: cv.id,
    })
  })
})
