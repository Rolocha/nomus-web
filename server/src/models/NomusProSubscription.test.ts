import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { NomusProFeature } from 'src/util/enums'
import { createMockNomusProSubscription } from 'src/__mocks__/models/NomusProSubscription'
import { DateTime } from 'luxon'

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

  const now = DateTime.now()

  describe('isActive', () => {
    it('returns false if the currentPeriodEndsAt is in the past', async () => {
      const sub = await createMockNomusProSubscription({
        currentPeriodStartsAt: now.minus({ days: 10 }).toSeconds(),
        currentPeriodEndsAt: now.minus({ days: 5 }).toSeconds(),
      })

      expect(sub.isActive()).toBe(false)
    })

    it('returns true if the currentPeriodEndsAt is in the future', async () => {
      const now = DateTime.now()
      const sub = await createMockNomusProSubscription({
        currentPeriodStartsAt: now.minus({ days: 1 }).toSeconds(),
        currentPeriodEndsAt: now.plus({ days: 1 }).toSeconds(),
      })

      expect(sub.isActive()).toBe(true)
    })
  })

  describe('getAccessInfo', () => {
    it('returns the access info', async () => {
      const now = DateTime.now()
      const currentPeriodEndsAt = now.plus({ days: 1 }).toSeconds()
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
