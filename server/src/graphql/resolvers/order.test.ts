import { CardVersion, Order, User } from 'src/models'
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
  describe('createNewOrder', () => {
    it('creates a new order for a user', async () => {
      const user = await createMockUser()
      const payload = {
        quantity: 25,
        shippingAddress: {
          line1: '637 Levering',
          line2: 'Unit 123',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90072',
        },
        cardSpec: {
          cardSlug: 'slug',
          vcfNotes: 'Cool Dude',
          frontImageDataUrl: 's3://some_url_front',
          backImageDataUrl: 's3://some_url_back',
        },
      }
      const response = await execQuery({
        source: `
            mutation CreateNewOrderTestQuery($userId: String, $payload: UpsertCustomOrderInput!) {
              upsertCustomOrder(userId: $userId, payload: $payload) {
                clientSecret
                orderId
              }
            }
          `,
        variableValues: {
          payload,
        },
        contextUser: user,
      })
      const newOrder = await Order.mongo.findById(response.data?.upsertCustomOrder?.orderId)
      // TODO: Modify Order Resolver to include front/back image url's uploaded to S3
      // const newCardVersion = await CardVersion.mongo.findById(newOrder.cardVersion)
      expect(newOrder.quantity).toEqual(payload.quantity)
      expect(newOrder.state).toEqual(OrderState.Captured)
      expect(newOrder.shippingAddress).toMatchObject(payload.shippingAddress)
    })
    it('creates a new order for a user as an admin', async () => {
      const user = await createMockUser()
      const payload = {
        quantity: 25,
        shippingAddress: {
          line1: '637 Levering',
          line2: 'Unit 123',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90072',
        },
        cardSpec: {
          cardSlug: 'slug',
          vcfNotes: 'Cool Dude',
          frontImageDataUrl: 's3://some_url_front',
          backImageDataUrl: 's3://some_url_back',
        },
      }
      const response = await execQuery({
        source: `
            mutation CreateNewOrderTestQuery($userId: String, $payload: UpsertCustomOrderInput!) {
              upsertCustomOrder(userId: $userId, payload: $payload) {
                clientSecret
                orderId
              }
            }
          `,
        variableValues: {
          userId: user.id,
          payload,
        },
        asAdmin: true,
      })
      const newOrder = await Order.mongo.findById(response.data?.upsertCustomOrder?.orderId)
      const newCardVersion = await CardVersion.mongo.findById(newOrder.cardVersion)
      expect(newOrder.quantity).toEqual(payload.quantity)
      expect(newOrder.state).toEqual(OrderState.Captured)
      expect(newOrder.shippingAddress).toMatchObject(payload.shippingAddress)
      const orderUser = await User.mongo.findById(newOrder.user)
      const cardVersionUser = await User.mongo.findById(newCardVersion.user)
      expect(orderUser.id).toBe(user.id)
      expect(cardVersionUser.id).toBe(user.id)
    })
  })

  describe('OrderModel', () => {
    it('detects a shortId collision and retries', async () => {
      const order1 = await createMockOrder({ shortId: 'SJC123' })
      const order2 = await createMockOrder({ shortId: 'SJC123' })
      expect(order1.shortId).toBe('SJC123')
      expect(order1.shortId).not.toEqual(order2.shortId)
    })
  })
})
