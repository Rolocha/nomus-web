import { Order } from 'src/models'
import { createMockUser } from './User'
import { createMockCardVersion } from './CardVersion'
import { OrderState } from 'src/util/enums'
import { createMockCard } from './Card'

export const createMockOrder = async (override: Partial<Order> = {}) => {
  const userInPayload = await createMockUser()
  const cardVersionInPayload = await createMockCardVersion({ user: userInPayload._id })
  const cardsInPayload = [
    await createMockCard({ user: userInPayload._id, cardVersion: cardVersionInPayload }),
  ]

  const newOrderPayload: Partial<Order> = {
    user: override.user ?? userInPayload,
    cardVersion: override.cardVersion ?? cardVersionInPayload,
    quantity: override.quantity ?? 25,
    price: override.price ?? 27.99,
    cards: override.cards ?? cardsInPayload,
    state: override.state ?? OrderState.Captured,
    tracking: override.tracking ?? '0000000000000',
    ...override,
  }

  return await Order.mongo.create(newOrderPayload)
}
