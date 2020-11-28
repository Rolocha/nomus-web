import { Card } from 'src/models'
import { createMockUser } from './User'

export const createMockCard = async (override: Partial<Card> = {}) => {
  const userInPayload = await createMockUser()

  const newOrderPayload: Partial<Card> = {
    user: override.user ?? userInPayload,
    nfcId: override.nfcId ?? 'sheet_5fc2001cc82995e1d59c204f-card_5fc2001cc82995e1d59c204b',
    qrUrl: override.qrUrl ?? 'cardv_abcd',
    ...override,
  }

  return await Card.mongo.create(newOrderPayload)
}
