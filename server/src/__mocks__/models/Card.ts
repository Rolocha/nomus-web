import { Card } from 'src/models'
import { createMockUser } from './User'

export const createMockCard = async (override: Partial<Card> = {}) => {
  const userInPayload = await createMockUser()

  const newOrderPayload: Partial<Card> = {
    user: override.user ?? userInPayload,
    nfcUrl: override.nfcUrl ?? 'sheet_ABCD-card_ABCD',
    qrUrl: override.qrUrl ?? 'cardv_abcd',
    ...override,
  }

  return await Card.mongo.create(newOrderPayload)
}
