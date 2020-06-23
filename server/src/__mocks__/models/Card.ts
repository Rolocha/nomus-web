import { Card } from 'src/models'
import { createMockUser } from './User'
import { createMockCardVersion } from './CardVersion'

export const createMockCard = async (override: Partial<Card> = {}) => {
  const userInPayload = await createMockUser()

  const newOrderPayload: Partial<Card> = {
    user: override.user ?? userInPayload,
    cardVersion: override.cardVersion ?? (await createMockCardVersion({ user: userInPayload })),
    ...override,
  }

  return await Card.mongo.create(newOrderPayload)
}
