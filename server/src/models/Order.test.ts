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
})
