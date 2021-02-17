import OrderEvent from 'src/models/OrderEvent'
import { OrderEventTrigger, OrderState } from 'src/util/enums'
import { createMockOrder } from './Order'

export const createMockOrderEvent = async (override: Partial<OrderEvent> = {}) => {
  const orderInPayload = await createMockOrder()

  const newOrderPayload: Partial<OrderEvent> = {
    order: override.order ?? orderInPayload,
    trigger: override.trigger ?? OrderEventTrigger.Nomus,
    state: override.state ?? OrderState.Captured,
    ...override,
  }

  return await OrderEvent.mongo.create(newOrderPayload)
}
