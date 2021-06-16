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

  it('works for 10-digit phone numbers', async () => {
    const user = await createMockUser({
      phoneNumber: '1234567890',
    })
    await user.save()

    await phoneNumberE164FormatMigration.execute()

    const migratedUser = await User.mongo.findById(user.id)
    expect(migratedUser.phoneNumber).toBe('+1' + user.phoneNumber)
  })

  it('works for 11-digit phone numbers', async () => {
    const user = await createMockUser({
      phoneNumber: '11234567890',
    })
    await user.save()

    await phoneNumberE164FormatMigration.execute()

    const migratedUser = await User.mongo.findById(user.id)
    expect(migratedUser.phoneNumber).toBe('+' + user.phoneNumber)
  })
})
