import { User } from 'src/models'
import { ORDER_STATE_EMAIL_NOTIFICATION_TEMPLATES } from 'src/models/Order'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { OrderEventTrigger, OrderState } from 'src/util/enums'
import { sgMail } from 'src/util/sendgrid'
import { createMockOrder } from 'src/__mocks__/models/Order'
import OrderEvent from './OrderEvent'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('Order model', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('creating a new order', () => {
    it('detects a shortId collision and retries', async () => {
      const order1 = await createMockOrder({ shortId: 'SJC123' })
      const order2 = await createMockOrder({ shortId: 'SJC123' })
      expect(order1.shortId).toBe('SJC123')
      expect(order1.shortId).not.toEqual(order2.shortId)
    })
  })

  describe('cancelOrder', () => {
    it.each([OrderState.Captured, OrderState.Paid, OrderState.Reviewed])(
      `successfully cancels the order if it's in the %s state`,
      async (initialState) => {
        const order = await createMockOrder({ state: initialState })
        expect(order.state).toBe(initialState)
        await order.transition(OrderState.Canceled)
        expect(order.state).toBe(OrderState.Canceled)
      }
    )

    it.each([OrderState.Creating, OrderState.Created, OrderState.Enroute, OrderState.Fulfilled])(
      `fails to cancel the order if it's in the %s state`,
      async (initialState) => {
        const order = await createMockOrder({ state: initialState })
        expect(order.state).toBe(initialState)
        const result = await order.transition(OrderState.Canceled)
        expect(result.error.name).toBe('invalid-transition')
        expect(order.state).toBe(initialState)
      }
    )
  })

  describe('transitionState', () => {
    it('Goes through full Order State Machine', async () => {
      const order = await createMockOrder()
      expect(order.state).toBe(OrderState.Captured)

      await order.transition(OrderState.Paid, OrderEventTrigger.Payment)
      expect(order.state).toBe(OrderState.Paid)

      await order.transition(OrderState.Reviewed, OrderEventTrigger.Internal)
      expect(order.state).toBe(OrderState.Reviewed)

      await order.transition(OrderState.Creating)
      expect(order.state).toBe(OrderState.Creating)

      await order.transition(OrderState.Created, OrderEventTrigger.Printer)
      expect(order.state).toBe(OrderState.Created)

      await order.transition(OrderState.Enroute)
      expect(order.state).toBe(OrderState.Enroute)

      await order.transition(OrderState.Fulfilled, OrderEventTrigger.Transport)
      expect(order.state).toBe(OrderState.Fulfilled)

      // Check that all OrderEvents are in the right order, with the right history
      const orderEvents = await OrderEvent.mongo.find({ order: order.id }).sort({ createdAt: 1 })
      expect(orderEvents).toEqual([
        expect.objectContaining({
          state: OrderState.Captured,
          trigger: OrderEventTrigger.Nomus,
        }),
        expect.objectContaining({
          state: OrderState.Paid,
          trigger: OrderEventTrigger.Payment,
        }),
        expect.objectContaining({
          state: OrderState.Reviewed,
          trigger: OrderEventTrigger.Internal,
        }),
        expect.objectContaining({
          state: OrderState.Creating,
          trigger: OrderEventTrigger.Nomus,
        }),
        expect.objectContaining({
          state: OrderState.Created,
          trigger: OrderEventTrigger.Printer,
        }),
        expect.objectContaining({
          state: OrderState.Enroute,
          trigger: OrderEventTrigger.Nomus,
        }),
        expect.objectContaining({
          state: OrderState.Fulfilled,
          trigger: OrderEventTrigger.Transport,
        }),
      ])
    })
    it('Tries to do an improper state transition and fails', async () => {
      const order = await createMockOrder()
      const res = await order.transition(OrderState.Fulfilled)
      expect(order.state).toBe(OrderState.Captured)
      expect(res.isSuccess).toBe(false)
      expect(res.error.name).toBe('invalid-transition')

      const orderEvents = await OrderEvent.mongo.find({ order: order.id }).sort({ createdAt: 1 })
      expect(orderEvents).toEqual([
        expect.objectContaining({
          state: OrderState.Captured,
          trigger: OrderEventTrigger.Nomus,
        }),
      ])
    })
  })
})
