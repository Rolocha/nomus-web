import { Order } from 'src/models'
import { OrderPrice } from 'src/models/subschemas'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { OrderState } from 'src/util/enums'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('OrderResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('order', () => {
    it('fetches a single order for non-admin user', async () => {
      const user = await createMockUser()
      const order = await createMockOrder({ user: user })

      const response = await execQuery({
        source: `
        query OrderTestQuery($orderId: String) {
          order(orderId: $orderId) {
            id
          }
        }
        `,
        variableValues: {
          orderId: order.id,
        },
        contextUser: user,
      })

      expect(response.data?.order?.id).toBe(order.id)
    })
    it('fails to fetch a single order for non-admin user', async () => {
      const user = await createMockUser()
      const order = await createMockOrder({ user: user })
      const userHacker = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })

      const response = await execQuery({
        source: `
          query OrderTestQuery($orderId: String) {
            order(orderId: $orderId) {
              id
            }
          }
          `,
        variableValues: {
          orderId: order.id,
        },
        contextUser: userHacker,
      })

      expect(response.errors[0]?.message).toBe('User is not authorized to access order')
    })
    it('fetches a single order for admin user', async () => {
      const order = await createMockOrder()

      const response = await execQuery({
        source: `
          query OrderTestQuery($orderId: String) {
            order(orderId: $orderId) {
              id
            }
          }
          `,
        variableValues: {
          orderId: order.id,
        },
        asAdmin: true,
      })

      expect(response.data?.order?.id).toBe(order.id)
    })
  })

  describe('cancelOrder', () => {
    it('cancels the specified order belonging to the context user', async () => {
      const user = await createMockUser()
      const order = await createMockOrder({ user: user.id })

      const response = await execQuery({
        source: `
        mutation CancelOrderMutation($orderId: String!) {
          transitionOrderState(orderId: $orderId, futureState: ${OrderState.Canceled}) {
            id
            state
          }
        }
        `,
        variableValues: {
          orderId: order.id,
        },
        contextUser: user,
      })

      expect(response.data?.transitionOrderState?.id).toBe(order.id)
      const updatedOrder = await Order.mongo.findById(order.id)
      expect(updatedOrder.state).toBe(OrderState.Canceled)
    })

    it("reports no order if the order exists but doesn't belong to the context user", async () => {
      const user = await createMockUser()
      const contextUser = await createMockUser()
      const order = await createMockOrder({ user: user.id })

      const response = await execQuery({
        source: `
        mutation CancelOrderMutation($orderId: String!) {
          transitionOrderState(orderId: $orderId, futureState: ${OrderState.Canceled}) {
            id
            state
          }
        }
        `,
        variableValues: {
          orderId: order.id,
        },
        contextUser: contextUser,
      })

      expect(response.errors).toContainEqual(
        expect.objectContaining({
          message: 'no-matching-order',
        })
      )
    })
  })
  describe('orders', () => {
    it('fetches all orders for a user', async () => {
      const user = await createMockUser()
      const order1 = await createMockOrder({ user: user })
      const order2 = await createMockOrder({ user: user })
      const response = await execQuery({
        source: `
          query OrdersTestQuery {
            orders {
              id
            }
          }
          `,
        contextUser: user,
      })
      expect(response.data?.orders).toEqual([{ id: order1.id }, { id: order2.id }])
    })
    it('fetches all users orders for an admin', async () => {
      const user = await createMockUser()
      const order1 = await createMockOrder({ user: user })
      const order2 = await createMockOrder({ user: user })
      const response = await execQuery({
        source: `
          query OrdersTestQuery($userId: String!) {
            orders(userId: $userId) {
              id
            }
          }
          `,
        variableValues: {
          userId: user.id,
        },
        asAdmin: true,
      })
      expect(response.data?.orders).toEqual([{ id: order1.id }, { id: order2.id }])
    })
  })
  describe('updateOrder', () => {
    it('updates an order', async () => {
      const user = await createMockUser()
      const order = await createMockOrder({ user: user, printSpecUrl: 'printTest' })

      const shippingLabelTestUrl = 'this-is-a-url.com'
      const trackingNumberTest = 'woooo'
      const priceTest: OrderPrice = {
        subtotal: 5,
        tax: 1,
        shipping: 3.75,
        total: 100,
      }

      const response = await execQuery({
        source: `
          mutation UpdateOrderTestQuery($orderId: String, $payload: UpdateOrderInput) {
            updateOrder(orderId: $orderId, payload: $payload) {
              id,
              state,
              shippingLabelUrl,
              trackingNumber,
              printSpecUrl,
              price {
                subtotal,
                tax,
                shipping,
                total
              }
            }
          }
        `,
        variableValues: {
          orderId: order.id,
          payload: {
            shippingLabelUrl: shippingLabelTestUrl,
            trackingNumber: trackingNumberTest,
            price: priceTest,
          },
        },
        asAdmin: true,
      })
      expect(response.data?.updateOrder).toMatchObject({
        id: order.id,
        state: OrderState.Captured,
        shippingLabelUrl: shippingLabelTestUrl,
        trackingNumber: trackingNumberTest,
        price: priceTest,
        printSpecUrl: 'printTest',
      })
    })
  })
  describe('retool', () => {
    it('gets all orders in Paid and Creating with the User names', async () => {
      const userJohn = await createMockUser()
      const userJeff = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })
      const order1 = await createMockOrder({ user: userJohn, state: OrderState.Paid })
      const order2 = await createMockOrder({ user: userJeff, state: OrderState.Creating })
      await createMockOrder({ user: userJohn, state: OrderState.Captured }) // this shouldn't be in the response

      const response = await execQuery({
        source: `
          query RetoolPrintBatchTestQuery {
            printBatchOrders {
              id,
              user {
                name {
                  first,
                  middle,
                  last,
                },
                email,
              },
              quantity,
              state,
              shortId,
            }
          }
        `,
        asAdmin: true,
      })

      expect(response.data?.printBatchOrders?.length).toBe(2)
      expect(response.data?.printBatchOrders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: {
              name: {
                first: userJohn.name.first,
                middle: userJohn.name.middle,
                last: userJohn.name.last,
              },
              email: userJohn.email,
            },
            id: order1.id,
            quantity: order1.quantity,
            state: order1.state,
            shortId: order1.shortId,
          }),
          expect.objectContaining({
            user: {
              name: {
                first: userJeff.name.first,
                middle: userJeff.name.middle,
                last: userJeff.name.last,
              },
              email: userJeff.email,
            },
            id: order2.id,
            quantity: order2.quantity,
            state: order2.state,
            shortId: order2.shortId,
          }),
        ])
      )
    })
  })
})
