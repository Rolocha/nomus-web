import { NomusProSubscription } from 'src/models'
import { createMockUser } from './User'

export const createMockNomusProSubscription = async (
  nomusProSubscriptionOverride: Partial<NomusProSubscription> = {}
) => {
  const user = nomusProSubscriptionOverride.user ?? (await createMockUser())
  const stripeSubscription = 'sub_blahblah'
  const nowInSeconds = new Date().getTime() / 1000
  const tenDaysInSeconds = 60 * 60 * 24 * 10
  const newNomusProSubscriptionPayload: Partial<NomusProSubscription> = {
    user,
    stripeSubscription,
    currentPeriodStartsAt: nowInSeconds - tenDaysInSeconds,
    currentPeriodEndsAt: nowInSeconds + tenDaysInSeconds,
    ...nomusProSubscriptionOverride,
  }

  return await NomusProSubscription.mongo.create(newNomusProSubscriptionPayload)
}
