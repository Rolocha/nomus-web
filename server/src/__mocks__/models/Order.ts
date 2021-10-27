import { Order } from 'src/models'
import { INITIAL_ORDER_STATE } from 'src/util/enums'
import { createMockCardVersion } from './CardVersion'
import { createMockUser } from './User'

export const createMockOrder = async (override: Partial<Order> = {}) => {
  const userInPayload = await createMockUser()
  const cardVersionInPayload = await createMockCardVersion({ user: userInPayload._id })

  const newOrderPayload: Partial<Order> = {
    user: override.user ?? userInPayload,
    cardVersion: override.cardVersion ?? cardVersionInPayload,
    quantity: override.quantity ?? 25,
    price: override.price ?? {
      subtotal: 2599,
      tax: 100,
      shipping: 500,
      discount: 100,
      total: 3099,
    },
    state: override.state ?? INITIAL_ORDER_STATE,
    trackingNumber: override.trackingNumber ?? '0000000000000',
    shippingAddress: {
      line1: 'Rausch St.',
      line2: '404',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
    },
    ...override,
  }

  return await Order.mongo.create(newOrderPayload)
}
