import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { OrderEventTrigger, OrderState, Role } from 'src/util/enums'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockOrderEvent } from 'src/__mocks__/models/OrderEvent'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('OrderEventResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('orderEvent', () => {
    it('Gets an OrderEvent specified by an OrderEventID', async () => {
      const user = await createMockUser({ roles: [Role.Admin] })
      const order = await createMockOrder({ user: user })
      const orderEvent = await createMockOrderEvent({ order: order })

      const response = await execQuery({
        source: `
        query OrderEventTestQuery($orderEventId: String) {
          orderEvent(orderEventId: $orderEventId) {
            id
            state
            order {
              id
            }
          }
        }
        `,
        variableValues: {
          orderEventId: orderEvent.id,
        },
        contextUser: user,
      })

      expect(response.data?.orderEvent?.id).toBe(orderEvent.id)
      expect(response.data?.orderEvent?.order?.id).toBe(order.id)
    })
  })

  describe('orderEventsForOrder', () => {
    it('Gets OrderEvents from an OrderID', async () => {
      // For some reason, the return from GQL has a capitalized first character and idk why
      // e.g. "paid" -> "Paid"
      function capitalize(toCap: string) {
        return toCap.charAt(0).toUpperCase() + toCap.slice(1)
      }

      const user = await createMockUser({ roles: [Role.Admin] })
      const order = await createMockOrder()
      await order.transition(OrderState.Paid, OrderEventTrigger.Payment)
      await order.transition(OrderState.Creating)

      const response = await execQuery({
        source: `
        query OrderEventsTestQuery($orderId: String) {
          orderEventsForOrder(orderId: $orderId) {
            id
            state
            trigger
          }
        }
        `,
        variableValues: {
          orderId: order.id,
        },
        contextUser: user,
      })

      expect(response.data?.orderEventsForOrder).toEqual([
        expect.objectContaining({
          state: capitalize(OrderState.Captured),
          trigger: capitalize(OrderEventTrigger.Nomus),
        }),
        expect.objectContaining({
          state: capitalize(OrderState.Paid),
          trigger: capitalize(OrderEventTrigger.Payment),
        }),
        expect.objectContaining({
          state: capitalize(OrderState.Creating),
          trigger: capitalize(OrderEventTrigger.Nomus),
        }),
      ])
    })
  })
})
