import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { NomusProFeature } from 'src/util/enums'
import { createMockNomusProSubscription } from 'src/__mocks__/models/NomusProSubscription'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('NomusProSubscription model', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('isActive', () => {
    it('returns false if the currentPeriodEndsAt is in the past', async () => {
      const nowInSeconds = new Date().getTime() / 1000
      const sub = await createMockNomusProSubscription({
        currentPeriodStartsAt: nowInSeconds - 200000,
        currentPeriodEndsAt: nowInSeconds - 100000,
      })

      expect(sub.isActive()).toBe(false)
    })

    it('returns false if the currentPeriodEndsAt is in the future', async () => {
      const nowInSeconds = new Date().getTime() / 1000
      const sub = await createMockNomusProSubscription({
        currentPeriodStartsAt: nowInSeconds - 200000,
        currentPeriodEndsAt: nowInSeconds + 100000,
      })

      expect(sub.isActive()).toBe(true)
    })
  })

  describe('getAccessInfo', () => {
    it('returns the access info', async () => {
      const nowInSeconds = new Date().getTime() / 1000
      const currentPeriodEndsAt = nowInSeconds + 100000
      const sub = await createMockNomusProSubscription({
        currentPeriodStartsAt: 0,
        currentPeriodEndsAt,
      })

      expect(sub.getAccessInfo()).toMatchObject({
        hasAccessUntil: currentPeriodEndsAt,
        id: sub.id,
        featureSet: {
          [NomusProFeature.UseCustomTapLink]: false,
        },
      })
    })
  })
})
