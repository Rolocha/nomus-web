import { Order, User } from 'src/models'
import { Address, OrderPrice, PersonName } from 'src/models/subschemas'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { INITIAL_ORDER_STATE, OrderEventTrigger, OrderState } from 'src/util/enums'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockUser } from 'src/__mocks__/models/User'
import { SendgridTemplate, sgMail } from 'src/util/sendgrid'
import { getCostSummary } from 'src/util/pricing'
import * as fileUtil from 'src/util/file'
import * as S3 from 'src/util/s3'
import PrintSpec from 'src/lib/print-spec'
import { mocked } from 'ts-jest/utils'
import { Result } from 'src/util/error'

jest.setTimeout(30000)
jest.mock('src/util/file')
const mockedFileUtil = mocked(fileUtil)
jest.mock('src/lib/print-spec')
const mockedPrintSpec = mocked(PrintSpec)
jest.mock('src/util/s3')
const mockedS3Module = mocked(S3)

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
        state: OrderState.Actionable,
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
            states: [OrderState.Actionable],
          },
        },
        asAdmin: true,
      })

      expect(response.data?.orders.length).toBe(1)
      expect(response.data?.orders).toEqual([
        expect.objectContaining({
          id: order.id,
          state: OrderState.Actionable,
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
          state: INITIAL_ORDER_STATE,
        }),
        expect.objectContaining({
          id: order2.id,
          state: INITIAL_ORDER_STATE,
        }),
      ])
      expect(response.data?.orders).not.toContain(
        expect.objectContaining({
          id: notInQueryOrder.id,
          state: INITIAL_ORDER_STATE,
        })
      )
    })
    it('fetches orders from a list of states', async () => {
      const user = await createMockUser()
      const order1 = await createMockOrder({ user: user, state: OrderState.Creating })
      const order2 = await createMockOrder({ user: user, state: OrderState.Actionable })
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
            states: [OrderState.Actionable, OrderState.Creating],
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
          state: OrderState.Actionable,
        }),
      ])
      expect(response.data?.orders).not.toContain(
        expect.objectContaining({
          id: notInQueryOrder.id,
          state: INITIAL_ORDER_STATE,
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
      const order2 = await createMockOrder({ user: user, state: OrderState.Actionable })
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
          state: OrderState.Actionable,
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
          state: INITIAL_ORDER_STATE,
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
          state: INITIAL_ORDER_STATE,
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
        state: OrderState.Actionable,
        shippingLabelUrl: null,
        trackingNumber: null,
      })
      const order2 = await createMockOrder({
        user: user,
        state: OrderState.Actionable,
        shippingLabelUrl: null,
        trackingNumber: null,
      })
      const notInQueryOrder = await createMockOrder({
        user: userJeff,
        state: OrderState.Actionable,
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
            states: [OrderState.Actionable],
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
          state: OrderState.Actionable,
          shippingLabelUrl: null,
          trackingNumber: null,
        }),
        expect.objectContaining({
          id: order2.id,
          state: OrderState.Actionable,
          shippingLabelUrl: null,
          trackingNumber: null,
        }),
      ])
      expect(response.data?.orders).not.toContain(
        expect.objectContaining({
          id: notInQueryOrder.id,
          state: OrderState.Actionable,
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
        subtotal: 500,
        tax: 100,
        shipping: 375,
        discount: 375,
        total: 600,
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
                discount,
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
        state: INITIAL_ORDER_STATE,
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
      const orderJohn = await createMockOrder({ user: userJohn, state: OrderState.Actionable })
      const orderJeff = await createMockOrder({ user: userJeff, state: OrderState.Actionable })

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
      const orderJohn = await createMockOrder({ user: userJohn, state: OrderState.Actionable })
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
          state: OrderState.Actionable,
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
        discount: 100,
        total: 5327,
      }
      const paymentIntent = 'pi_1234'

      const response = await execQuery({
        source: `
            mutation ManualOrder($payload: ManualOrderInput!) {
              submitManualOrder(payload: $payload) {
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
                  discount
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
            paymentIntent,
          },
        },
        asAdmin: true,
      })

      const orderDetails = response.data?.submitManualOrder

      expect(orderDetails.id).not.toBeNull()
      expect(orderDetails.trackingNumber).toBeNull()
      expect(orderDetails.shortId).not.toBeNull()
      expect(orderDetails.quantity).toBe(quantity)
      expect(orderDetails.shippingName).toBe(user.fullName)
      expect(orderDetails.shippingAddress).toMatchObject(shippingAddress)
      expect(orderDetails.price).toMatchObject(price)
      expect(orderDetails.state).toBe(OrderState.Actionable)
      expect(orderDetails.paymentIntent).toBe('pi_1234')

      expect(orderDetails.user.id).toBe(user.id)
      expect(orderDetails.user.email).toBe(user.email)
      expect(JSON.stringify(orderDetails.user.name)).toEqual(JSON.stringify(user.name))

      expect(orderDetails.cardVersion.id).not.toBeNull()
      expect(orderDetails.cardVersion.user.id).toBe(user.id)
      expect(orderDetails.cardVersion.frontImageUrl).toBeNull()
      expect(orderDetails.cardVersion.backImageUrl).toBeNull()

      expect(sgMail.send).toBeCalledTimes(0)
    })
    it('properly creates a manual order for a new user and sends them an update email', async () => {
      const userEmail = 'coolboi@a24.com'
      const userName: PersonName = {
        first: 'coolest',
        middle: 'ever',
        last: 'boi',
      }
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
        discount: 100,
        total: 5327,
      }

      const response = await execQuery({
        source: `
            mutation ManualOrder($payload: ManualOrderInput!) {
              submitManualOrder(payload: $payload) {
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
                  discount
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
          `,
        variableValues: {
          payload: {
            email: userEmail,
            name: userName,
            quantity,
            shippingAddress,
            price,
          },
        },
        asAdmin: true,
      })

      const orderDetails = response.data?.submitManualOrder

      const user = (await User.mongo.findOne({ email: userEmail })) as User

      expect(orderDetails.id).not.toBeNull()
      expect(orderDetails.trackingNumber).toBeNull()
      expect(orderDetails.shortId).not.toBeNull()
      expect(orderDetails.quantity).toBe(quantity)
      expect(orderDetails.shippingName).toBe(
        [user.name.first, user.name.middle, user.name.last].join(' ')
      )
      expect(orderDetails.shippingAddress).toMatchObject(shippingAddress)
      expect(orderDetails.price).toMatchObject(price)
      expect(orderDetails.state).toBe(OrderState.Actionable)

      expect(orderDetails.user.id).toBe(user.id)
      expect(orderDetails.user.email).toBe(user.email)
      expect(JSON.stringify(orderDetails.user.name)).toEqual(JSON.stringify(user.name))
      expect(user.isEmailVerified).toBeTruthy()

      expect(orderDetails.cardVersion.id).not.toBeNull()
      expect(orderDetails.cardVersion.user.id).toBe(user.id)

      expect(sgMail.send).toBeCalledWith({
        to: user.email,
        from: 'hi@nomus.me',
        templateId: SendgridTemplate.ManualSubmission,
        dynamicTemplateData: {
          passwordResetLink: expect.stringMatching(/reset-password\?/),
          firstName: user.name.first,
        },
      })
    })
    it('calculates price based on shipping address and quantity if price is not included', async () => {
      const user: User = await createMockUser()
      const quantity = 100
      const shippingAddress: Address = {
        line1: '1600 Pennsylvania Ave.',
        line2: 'Red Room',
        city: 'Washington',
        state: 'DC',
        postalCode: '20502',
      }

      const response = await execQuery({
        source: `
            mutation ManualOrder($payload: ManualOrderInput!) {
              submitManualOrder(payload: $payload) {
                id
                price {
                  subtotal
                  tax
                  shipping
                  total
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
          },
        },
        asAdmin: true,
      })

      const orderDetails = response.data?.submitManualOrder

      const costSummary = getCostSummary(quantity, shippingAddress.state)
      expect(orderDetails.price).toMatchObject({
        shipping: costSummary.shipping,
        subtotal: costSummary.subtotal,
        tax: costSummary.estimatedTaxes,
        total: costSummary.total,
      })

      expect(sgMail.send).toBeCalledTimes(0)
    })
  })

  describe('updatePrintSpec', () => {
    it('generates a print spec PDF and uploads to S3', async () => {
      const cardVersion = await createMockCardVersion({
        frontImageUrl: 'https://s3.com/front.png',
        backImageUrl: 'https://s3.com/back.png',
      })
      const order = await createMockOrder({ cardVersion, quantity: 75 })
      mockedFileUtil.downloadUrlToFile.mockImplementation((url, filename, tmpDirName) =>
        Promise.resolve(`/tmp/${tmpDirName}/${filename}`)
      )
      const generatePDFSpy = jest
        .spyOn(PrintSpec.prototype, 'generatePDF')
        .mockResolvedValue('/path/to/print-spec.pdf')

      const s3Key = `${order.shortId}-card-array.pdf`
      mockedS3Module.uploadFileToS3.mockResolvedValue(Result.ok(s3Key))

      await execQuery({
        source: `
            mutation updatePrintSpec($orderId: String!) {
              updatePrintSpec(orderId: $orderId)
            }
          `,
        variableValues: {
          orderId: order.id,
        },
        asAdmin: true,
      })

      expect(mockedFileUtil.downloadUrlToFile).toHaveBeenCalledWith(
        cardVersion.frontImageUrl,
        'front.png',
        'card-images'
      )
      expect(mockedFileUtil.downloadUrlToFile).toHaveBeenCalledWith(
        cardVersion.backImageUrl,
        'back.png',
        'card-images'
      )

      expect(mockedPrintSpec).toHaveBeenCalledWith(
        expect.objectContaining({
          frontImageLocalFilePath: expect.stringContaining('front.png'),
          backImageLocalFilePath: expect.stringContaining('back.png'),
          shortId: order.shortId,
        })
      )
      expect(generatePDFSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          numSheets: 3,
        })
      )

      expect(mockedS3Module.uploadFileToS3).toHaveBeenCalled()

      const updatedOrder = await Order.mongo.findOne({ _id: order.id })
      expect(updatedOrder.printSpecUrl).toBe(S3.getObjectUrl(s3Key))
    })
  })
})
