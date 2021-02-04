import { Order } from 'src/models'
import { OrderState } from 'src/util/enums'
import { createMockCardVersion } from './CardVersion'
import { createMockUser } from './User'

export const createMockOrder = async (override: Partial<Order> = {}) => {
  const userInPayload = await createMockUser()
  const cardVersionInPayload = await createMockCardVersion({ user: userInPayload.id })

  const newOrderPayload: Partial<Order> = {
    user: override.user ?? userInPayload,
    cardVersion: override.cardVersion ?? cardVersionInPayload,
    quantity: override.quantity ?? 25,
    price: override.price ?? {
      subtotal: 2599,
      tax: 100,
      shipping: 500,
      total: 3199,
    },
    state: override.state ?? OrderState.Captured,
    trackingNumber: override.trackingNumber ?? '0000000000000',
    shortId: override.shortId ?? 'SJC123',
    ...override,
  }

  return await Order.mongo.create(newOrderPayload)
}
