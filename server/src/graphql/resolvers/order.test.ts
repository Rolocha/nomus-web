import { Order, User } from 'src/models'
import { Address, OrderPrice } from 'src/models/subschemas'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { OrderEventTrigger, OrderState } from 'src/util/enums'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockUser } from 'src/__mocks__/models/User'
import fs from 'fs'
import OrderResolver from 'src/graphql/resolvers/order'
import { sgMail } from 'src/util/sendgrid'

jest.setTimeout(30000)

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

    it('cancels the specified order by an admin who is not the orders user', async () => {
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
        asAdmin: true,
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
    it('fetches data for the design review page', async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion()
      const order = await createMockOrder({
        user: user,
        cardVersion: cardVersion,
        state: OrderState.Paid,
      })

      const response = await execQuery({
        source: `
          query DesignReviewTestQuery($params: OrdersInput) {
            orders(params: $params) {
              id,
              state, 
              user {
                name {
                  first
                }
              },
              cardVersion {
                frontImageUrl
              }
            }
          }
        `,
        variableValues: {
          params: {
            states: [OrderState.Paid],
          },
        },
        asAdmin: true,
      })

      expect(response.data?.orders.length).toBe(1)
      expect(response.data?.orders).toEqual([
        expect.objectContaining({
          id: order.id,
          state: OrderState.Paid,
          user: {
            name: {
              first: user.name.first,
            },
          },
          cardVersion: {
            frontImageUrl: cardVersion.frontImageUrl,
          },
        }),
      ])
    })
    it('fetches orders from a list of order ids', async () => {
      const user = await createMockUser()
      const order1 = await createMockOrder({ user: user })
      const order2 = await createMockOrder({ user: user })
      const notInQueryOrder = await createMockOrder({ user: user })

      const response = await execQuery({
        source: `
          query OrdersListTestQuery($params: OrdersInput) {
            orders(params: $params) {
              id,
              state
            }
          }
        `,
        variableValues: {
          params: {
            orderIds: [order1.id, order2.id],
          },
        },
        asAdmin: true,
      })

      expect(response.data?.orders.length).toBe(2)
      expect(response.data?.orders).toEqual([
        expect.objectContaining({
          id: order1.id,
          state: OrderState.Captured,
        }),
        expect.objectContaining({
          id: order2.id,
          state: OrderState.Captured,
        }),
      ])
      expect(response.data?.orders).not.toContain(
        expect.objectContaining({
          id: notInQueryOrder.id,
          state: OrderState.Captured,
        })
      )
    })
    it('fetches orders from a list of states', async () => {
      const user = await createMockUser()
      const order1 = await createMockOrder({ user: user, state: OrderState.Creating })
      const order2 = await createMockOrder({ user: user, state: OrderState.Paid })
      const notInQueryOrder = await createMockOrder({ user: user })

      const response = await execQuery({
        source: `
          query OrdersListTestQuery($params: OrdersInput) {
            orders(params: $params) {
              id,
              state
            }
          }
        `,
        variableValues: {
          params: {
            states: [OrderState.Paid, OrderState.Creating],
          },
        },
        asAdmin: true,
      })

      expect(response.data?.orders.length).toBe(2)
      expect(response.data?.orders).toEqual([
        expect.objectContaining({
          id: order1.id,
          state: OrderState.Creating,
        }),
        expect.objectContaining({
          id: order2.id,
          state: OrderState.Paid,
        }),
      ])
      expect(response.data?.orders).not.toContain(
        expect.objectContaining({
          id: notInQueryOrder.id,
          state: OrderState.Captured,
        })
      )
    })
    it('fetches orders for a user', async () => {
      const user = await createMockUser()
      const userJeff = await createMockUser({
        name: { first: 'Jeff', last: 'Winger' },
        email: 'fakelawyer@greendale.com',
      })
      const order1 = await createMockOrder({ user: user, state: OrderState.Creating })
      const order2 = await createMockOrder({ user: user, state: OrderState.Paid })
      const notInQueryOrder = await createMockOrder({ user: userJeff })

      const response = await execQuery({
        source: `
          query OrdersListTestQuery($params: OrdersInput) {
            orders(params: $params) {
              id,
              state,
              user {
                name {
                  first
                }
              }
            }
          }
        `,
        variableValues: {
          params: {
            user: user.id,
          },
        },
        asAdmin: true,
      })

      expect(response.data?.orders.length).toBe(2)
      expect(response.data?.orders).toEqual([
        expect.objectContaining({
          id: order1.id,
          state: OrderState.Creating,
          user: {
            name: {
              first: 'John',
            },
          },
        }),
        expect.objectContaining({
          id: order2.id,
          state: OrderState.Paid,
          user: {
            name: {
              first: 'John',
            },
          },
        }),
      ])
      expect(response.data?.orders).not.toContain(
        expect.objectContaining({
          id: notInQueryOrder.id,
          state: OrderState.Captured,
          user: {
            name: {
              first: 'Jeff',
            },
          },
        })
      )
    })
    it('fetches orders with multi-field payload', async () => {
      const user = await createMockUser()
      const userJeff = await createMockUser({
        name: { first: 'Jeff', last: 'Winger' },
        email: 'fakelawyer@greendale.com',
      })
      const order1 = await createMockOrder({
        user: user,
        state: OrderState.Creating,
        trackingNumber: 'AAAA',
      })
      const order2 = await createMockOrder({
        user: user,
        state: OrderState.Creating,
        trackingNumber: 'BBBB',
      })
      const notInQueryOrder = await createMockOrder({ user: userJeff })

      const response = await execQuery({
        source: `
          query OrdersListTestQuery($params: OrdersInput) {
            orders(params: $params) {
              id,
              state
            }
          }
        `,
        variableValues: {
          params: {
            trackingNumber: 'AAAA',
            states: [OrderState.Creating],
          },
        },
        asAdmin: true,
      })

      expect(response.data?.orders.length).toBe(1)
      expect(response.data?.orders).toEqual([
        expect.objectContaining({
          id: order1.id,
          state: OrderState.Creating,
        }),
      ])
      expect(response.data?.orders).not.toContain(
        expect.objectContaining({
          id: notInQueryOrder.id,
          state: OrderState.Captured,
        })
      )
      expect(response.data?.orders).not.toContain(
        expect.objectContaining({
          id: order2.id,
          state: OrderState.Creating,
        })
      )
    })
    it('queries for paid, null shipping label and null tracking number', async () => {
      const user = await createMockUser()
      const userJeff = await createMockUser({
        name: { first: 'Jeff', last: 'Winger' },
        email: 'fakelawyer@greendale.com',
      })
      const order1 = await createMockOrder({
        user: user,
        state: OrderState.Paid,
        shippingLabelUrl: null,
        trackingNumber: null,
      })
      const order2 = await createMockOrder({
        user: user,
        state: OrderState.Paid,
        shippingLabelUrl: null,
        trackingNumber: null,
      })
      const notInQueryOrder = await createMockOrder({
        user: userJeff,
        state: OrderState.Paid,
        shippingLabelUrl: 'AAAA',
        trackingNumber: 'BBBB',
      })

      const response = await execQuery({
        source: `
          query OrdersListTestQuery($params: OrdersInput) {
            orders(params: $params) {
              id,
              state,
              shippingLabelUrl,
              trackingNumber
            }
          }
        `,
        variableValues: {
          params: {
            states: [OrderState.Paid],
            shippingLabelUrl: null,
            trackingNumber: null,
          },
        },
        asAdmin: true,
      })

      expect(response.data?.orders.length).toBe(2)
      expect(response.data?.orders).toEqual([
        expect.objectContaining({
          id: order1.id,
          state: OrderState.Paid,
          shippingLabelUrl: null,
          trackingNumber: null,
        }),
        expect.objectContaining({
          id: order2.id,
          state: OrderState.Paid,
          shippingLabelUrl: null,
          trackingNumber: null,
        }),
      ])
      expect(response.data?.orders).not.toContain(
        expect.objectContaining({
          id: notInQueryOrder.id,
          state: OrderState.Paid,
          shippingLabelUrl: 'AAAA',
          trackingNumber: 'BBBB',
        })
      )
    })
  })

  describe('userOrders', () => {
    it('fetches all orders for a user', async () => {
      const user = await createMockUser()
      const order1 = await createMockOrder({ user: user })
      const order2 = await createMockOrder({ user: user })
      const response = await execQuery({
        source: `
          query OrdersTestQuery {
            userOrders {
              id
            }
          }
          `,
        contextUser: user,
      })
      expect(response.data?.userOrders).toEqual([{ id: order1.id }, { id: order2.id }])
    })
    it('fetches all users orders for an admin', async () => {
      const user = await createMockUser()
      const order1 = await createMockOrder({ user: user })
      const order2 = await createMockOrder({ user: user })
      const response = await execQuery({
        source: `
          query OrdersTestQuery($userId: String!) {
            userOrders(userId: $userId) {
              id
            }
          }
          `,
        variableValues: {
          userId: user.id,
        },
        asAdmin: true,
      })
      expect(response.data?.userOrders).toEqual([{ id: order1.id }, { id: order2.id }])
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
          mutation UpdateOrderTestQuery($orderId: String, $payload: OrdersQueryInput) {
            updateOrder(orderId: $orderId, payload: $payload) {
              id,
              state,
              shippingLabelUrl,
              trackingNumber,
              printSpecUrl,
              notes,
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
            printSpecUrl: 'printTest',
            notes: 'test_notes',
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
        notes: 'test_notes',
      })
    })
  })
  describe('batchTransitionOrderState', () => {
    it('transitions a bunch of orders (happy path)', async () => {
      const userJohn = await createMockUser()
      const userJeff = await createMockUser({
        name: { first: 'Jeff', last: 'Winger' },
        email: 'fakelawyer@greendale.com',
      })
      const orderJohn = await createMockOrder({ user: userJohn, state: OrderState.Paid })
      const orderJeff = await createMockOrder({ user: userJeff, state: OrderState.Paid })

      const response = await execQuery({
        source: `
          mutation BatchTransitionMutation($orderIds: [String!]!, $futureState: OrderState!, $trigger: OrderEventTrigger!) {
            batchTransitionOrderState(orderIds: $orderIds, futureState: $futureState, trigger: $trigger) {
              id,
              state
            }
          }
        `,
        variableValues: {
          orderIds: [orderJohn.id, orderJeff.id],
          futureState: OrderState.Reviewed,
          trigger: OrderEventTrigger.Internal,
        },
        asAdmin: true,
      })

      const orders = await Order.mongo.find()

      expect(orders).toEqual([
        expect.objectContaining({
          id: orderJohn.id,
          state: OrderState.Reviewed,
        }),
        expect.objectContaining({
          id: orderJeff.id,
          state: OrderState.Reviewed,
        }),
      ])

      expect(response.data?.batchTransitionOrderState).toEqual([
        expect.objectContaining({
          id: orderJohn.id,
          state: OrderState.Reviewed,
        }),
        expect.objectContaining({
          id: orderJeff.id,
          state: OrderState.Reviewed,
        }),
      ])
    })
    it('fails on an improper transition, does not commit to db', async () => {
      const userJohn = await createMockUser()
      const userJeff = await createMockUser({
        name: { first: 'Jeff', last: 'Winger' },
        email: 'fakelawyer@greendale.com',
      })
      const orderJohn = await createMockOrder({ user: userJohn, state: OrderState.Paid })
      const orderJeff = await createMockOrder({ user: userJeff, state: OrderState.Created })

      const response = await execQuery({
        source: `
          mutation BatchTransitionMutation($orderIds: [String!]!, $futureState: OrderState!, $trigger: OrderEventTrigger!) {
            batchTransitionOrderState(orderIds: $orderIds, futureState: $futureState, trigger: $trigger) {
              id,
              state
            }
          }
        `,
        variableValues: {
          orderIds: [orderJohn.id, orderJeff.id],
          futureState: OrderState.Creating,
          trigger: OrderEventTrigger.Internal,
        },
        asAdmin: true,
      })

      const orders = await Order.mongo.find()

      expect(orders).toEqual([
        expect.objectContaining({
          id: orderJohn.id,
          state: OrderState.Paid,
        }),
        expect.objectContaining({
          id: orderJeff.id,
          state: OrderState.Created,
        }),
      ])

      expect(response.errors[0].message).toBe('invalid-transition')
    })
  })
  describe('submitManualOrder', () => {
    let sgMailSendSpy = null
    beforeEach(() => {
      sgMailSendSpy = jest.spyOn(sgMail, 'send').mockResolvedValue({} as any) // don't really care about response since we don't use it right now
    })

    afterEach(() => {
      sgMailSendSpy.mockClear()
    })
    it('properly creates a manual order that sets up all the requirements for an existing user', async () => {
      const user: User = await createMockUser()
      const quantity = 100
      const shippingAddress: Address = {
        line1: '1600 Pennsylvania Ave.',
        line2: 'Red Room',
        city: 'Washington',
        state: 'DC',
        postalCode: '20502',
      }
      const price: OrderPrice = {
        subtotal: 5000,
        tax: 427,
        shipping: 0,
        total: 5427,
      }

      const checkoutSessionSpy = jest
        .spyOn(OrderResolver.prototype, 'createCheckoutSession')
        .mockResolvedValue({
          id: 'cs_12345',
          object: 'checkout.session',
          /* eslint-disable camelcase */
          allow_promotion_codes: true,
          amount_subtotal: null,
          amount_total: null,
          billing_address_collection: null,
          cancel_url: 'https://nomus.me',
          client_reference_id: null,
          currency: 'usd',
          customer: null,
          customer_email: null,
          livemode: null,
          locale: null,
          metadata: null,
          mode: null,
          payment_intent: 'pi_1234',
          payment_method_types: [],
          setup_intent: null,
          shipping: null,
          shipping_address_collection: null,
          submit_type: null,
          subscription: null,
          success_url: 'https://nomus.me',
          total_details: null,
          /* eslint-enable camelcase */
        })

      const response = await execQuery({
        source: `
            mutation ManualOrder($payload: ManualOrderInput!) {
              submitManualOrder(payload: $payload) {
                order {
                  id
                  user {
                    id
                    email
                    name {
                      first
                      middle
                      last
                    }
                  }
                  cardVersion {
                    id
                    user { 
                      id
                    }
                    frontImageUrl
                    backImageUrl
                  }
                  quantity
                  price {
                    subtotal
                    tax
                    shipping
                    total
                  }
                  state
                  trackingNumber
                  paymentIntent
                  shortId
                  shippingName
                  shippingAddress {
                    line1
                    line2
                    city
                    state
                    postalCode
                  }
                }
              }
            }
          `,
        variableValues: {
          payload: {
            email: user.email,
            name: {
              first: user.name.first,
              middle: user.name.middle,
              last: user.name.last,
            },
            quantity,
            shippingAddress,
            price,
          },
        },
        asAdmin: true,
      })

      const orderDetails = response.data?.submitManualOrder?.order

      expect(orderDetails.id).not.toBeNull()
      expect(orderDetails.trackingNumber).toBeNull()
      expect(orderDetails.shortId).not.toBeNull()
      expect(orderDetails.quantity).toBe(quantity)
      expect(orderDetails.shippingName).toBe(
        [user.name.first, user.name.middle, user.name.last].join(' ')
      )
      expect(orderDetails.shippingAddress).toMatchObject(shippingAddress)
      expect(orderDetails.price).toMatchObject(price)
      expect(orderDetails.state).toBe(OrderState.Captured)
      expect(orderDetails.paymentIntent).toBe('pi_1234')

      expect(orderDetails.user.id).toBe(user.id)
      expect(orderDetails.user.email).toBe(user.email)
      expect(JSON.stringify(orderDetails.user.name)).toEqual(JSON.stringify(user.name))

      expect(orderDetails.cardVersion.id).not.toBeNull()
      expect(orderDetails.cardVersion.user.id).toBe(user.id)
      expect(orderDetails.cardVersion.frontImageUrl).toBeNull()
      expect(orderDetails.cardVersion.backImageUrl).toBeNull()

      expect(sgMail.send).toBeCalledTimes(0)
      expect(checkoutSessionSpy).toBeCalledTimes(1)
    })
    it('properly creates a manual order for a new user and sends them an update email', async () => {})
    it('calculates price based on shipping address and quantity if price is not included', async () => {})
    it('properly creates a manual order for a new user and sends them an update email', async () => {})
  })
})
