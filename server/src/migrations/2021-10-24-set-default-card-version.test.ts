import { User } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { doNTimes } from 'src/util/array'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockUser } from 'src/__mocks__/models/User'
import setDefaultCardVersionMigration from './2021-10-24-set-default-card-version'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('setDefaultCardVersion', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  it('does not update the defaultCardVersion for users who already have it set', async () => {
    const usersWithItSet = await Promise.all(
      doNTimes(3, async () => {
        const user = await createMockUser()
        const cardVersions = await Promise.all(
          doNTimes(3, () => createMockCardVersion({ user: user.id }))
        )
        user.defaultCardVersion = cardVersions[1]._id
        await user.save()
        return user
      })
    )
    const previousDefaultCardVersions = usersWithItSet.reduce((acc, u) => {
      acc[u.id] = u.defaultCardVersion
      return acc
    }, {})

    await setDefaultCardVersionMigration.execute()

    for (const user of usersWithItSet) {
      const postMigrationUser = await User.mongo.findById(user.id)
      expect(postMigrationUser.defaultCardVersion).toBe(previousDefaultCardVersions[user.id])
    }
  })

  it('sets the default card version for users missing it but who have 1+ card versions', async () => {
    const expectedDefaultCardVersions = {}
    const usersMissingDefaultCardVersion = await Promise.all(
      doNTimes(3, async () => {
        const user = await createMockUser()
        const cardVersion = await createMockCardVersion({ user: user.id })
        // Note: we don't set user.defaultCardVersion here
        expectedDefaultCardVersions[user.id] = cardVersion.id
        return user
      })
    )

    await setDefaultCardVersionMigration.execute()

    for (const user of usersMissingDefaultCardVersion) {
      const postMigrationUser = await User.mongo.findById(user.id)
      expect(postMigrationUser.defaultCardVersion).toBe(expectedDefaultCardVersions[user.id])
    }
  })
})
