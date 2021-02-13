import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { OrderState, Role } from 'src/util/enums'
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
      const user = await createMockUser({ roles: [Role.Admin] })
      const order = await createMockOrder({ user: user })
      const orderEvent2 = await createMockOrderEvent({ order: order, state: OrderState.Paid })
      const orderEvent3 = await createMockOrderEvent({ order: order, state: OrderState.Creating })

      const response = await execQuery({
        source: `
        query OrderEventsTestQuery($orderId: String) {
          orderEventsForOrder(orderId: $orderId) {
            id
          }
        }
        `,
        variableValues: {
          orderId: order.id,
        },
        contextUser: user,
      })

      //There's one OrderEvent created during pre-save of order, so should be 3 but we only know the id's of 2
      expect(response.data?.orderEventsForOrder.length).toBe(3)
      expect(response.data?.orderEventsForOrder).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: orderEvent2.id }),
          expect.objectContaining({ id: orderEvent3.id }),
        ])
      )
    })
  })
})
