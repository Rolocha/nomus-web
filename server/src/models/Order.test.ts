import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { OrderState } from 'src/util/enums'
import { createMockOrder } from 'src/__mocks__/models/Order'

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
    it.each([OrderState.Captured, OrderState.Paid])(
      `successfully cancels the order if it's in the %s state`,
      async (initialState) => {
        const order = await createMockOrder({ state: initialState })
        expect(order.state).toBe(initialState)
        await order.cancel()
        expect(order.state).toBe(OrderState.Canceled)
      }
    )

    it.each([OrderState.Creating, OrderState.Created, OrderState.Enroute, OrderState.Fulfilled])(
      `fails to cancel the order if it's in the %s state`,
      async (initialState) => {
        const order = await createMockOrder({ state: initialState })
        expect(order.state).toBe(initialState)
        const result = await order.cancel()
        expect(result.error.name).toBe('cannot-be-canceled')
        expect(order.state).toBe(initialState)
      }
    )
  })

  describe('transitionState', () => {
    it.only('knows good transisitions (delete this test)', async () => {
      const order = await createMockOrder({ state: OrderState.Creating })
      expect(order.isEligibleTransition(OrderState.Paid)).toBeFalsy()
      expect(order.isEligibleTransition(OrderState.Created)).toBeTruthy()
    })
  })
})
