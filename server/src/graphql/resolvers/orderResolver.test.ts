import { Order, CardVersion, User } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockUser } from 'src/__mocks__/models/User'
import MUUID from 'uuid-mongodb'
import { OrderState } from 'src/util/enums'

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
      const user_hacker = await createMockUser({
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
        contextUser: user_hacker,
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

      const orderPayload = {
        quantity: 25,
        price: 29.99,
      }
      const cardVersionPayload = {
        cardSlug: 'slug',
        firstName: 'A',
        middleName: 'B',
        lastName: 'C',
        phoneNumber: '1234567890',
        email: 'newone@gmail.com',
        title: 'president',
        company: 'united states',
        addressLine1: '637 Levering',
        addressLine2: '123',
        addressLine3: 'Los Angeles, CA, 90072',
        frontImageUrl: 's3://some_url_front',
        backImageUrl: 's3://some_url_back',
      }

      const response = await execQuery({
        source: `
          mutation CreateNewOrderTestQuery($userId: String, $orderPayload: OrderGenerationInput!, $cardVersionPayload: CardVersionInput!) {
            createNewOrder(userId: $userId, orderPayload: $orderPayload, cardVersionPayload: $cardVersionPayload) {
              orderId
              cardVersionId
            }
          }
        `,
        variableValues: {
          orderPayload: orderPayload,
          cardVersionPayload: cardVersionPayload,
        },
        contextUser: user,
      })

      const newOrder = await Order.mongo.findById(response.data?.createNewOrder?.orderId)
      const newCardVersion = await CardVersion.mongo.findById(
        MUUID.from(response.data?.createNewOrder?.cardVersionId)
      )

      expect(newOrder.quantity).toEqual(orderPayload.quantity)
      expect(newOrder.price).toEqual(orderPayload.price)
      expect(newOrder.state).toEqual(OrderState.Captured)

      const partialNewCardVersion = {
        cardSlug: newCardVersion.cardSlug,
        firstName: newCardVersion.name.first,
        middleName: newCardVersion.name.middle,
        lastName: newCardVersion.name.last,
        phoneNumber: newCardVersion.phoneNumber,
        email: newCardVersion.email,
        title: newCardVersion.title,
        company: newCardVersion.company,
        addressLine1: newCardVersion.address.line1,
        addressLine2: newCardVersion.address.line2,
        addressLine3: newCardVersion.address.line3,
        frontImageUrl: newCardVersion.frontImageUrl,
        backImageUrl: newCardVersion.backImageUrl,
      }
      expect(partialNewCardVersion).toMatchObject(cardVersionPayload)
    })
    it('creates a new order for a user as an admin', async () => {
      const user = await createMockUser()

      const orderPayload = {
        quantity: 25,
        price: 29.99,
      }
      const cardVersionPayload = {
        cardSlug: 'slug',
        firstName: 'A',
        middleName: 'B',
        lastName: 'C',
        phoneNumber: '1234567890',
        email: 'newone@gmail.com',
        title: 'president',
        company: 'united states',
        addressLine1: '637 Levering',
        addressLine2: '123',
        addressLine3: 'Los Angeles, CA, 90072',
        frontImageUrl: 's3://some_url_front',
        backImageUrl: 's3://some_url_back',
      }

      const response = await execQuery({
        source: `
          mutation CreateNewOrderTestQuery($userId: String, $orderPayload: OrderGenerationInput!, $cardVersionPayload: CardVersionInput!) {
            createNewOrder(userId: $userId, orderPayload: $orderPayload, cardVersionPayload: $cardVersionPayload) {
              orderId
              cardVersionId
            }
          }
        `,
        variableValues: {
          userId: user.id,
          orderPayload: orderPayload,
          cardVersionPayload: cardVersionPayload,
        },
        asAdmin: true,
      })

      const newOrder = await Order.mongo.findById(response.data?.createNewOrder?.orderId)
      const newCardVersion = await CardVersion.mongo.findById(
        MUUID.from(response.data?.createNewOrder?.cardVersionId)
      )

      expect(newOrder.quantity).toEqual(orderPayload.quantity)
      expect(newOrder.price).toEqual(orderPayload.price)
      expect(newOrder.state).toEqual(OrderState.Captured)

      const partialNewCardVersion = {
        cardSlug: newCardVersion.cardSlug,
        firstName: newCardVersion.name.first,
        middleName: newCardVersion.name.middle,
        lastName: newCardVersion.name.last,
        phoneNumber: newCardVersion.phoneNumber,
        email: newCardVersion.email,
        title: newCardVersion.title,
        company: newCardVersion.company,
        addressLine1: newCardVersion.address.line1,
        addressLine2: newCardVersion.address.line2,
        addressLine3: newCardVersion.address.line3,
        frontImageUrl: newCardVersion.frontImageUrl,
        backImageUrl: newCardVersion.backImageUrl,
      }
      expect(partialNewCardVersion).toMatchObject(cardVersionPayload)

      const orderUser = await User.mongo.findById(newOrder.user)
      const cardVersionUser = await User.mongo.findById(newCardVersion.user)

      expect(orderUser.id).toBe(user.id)
      expect(cardVersionUser.id).toBe(user.id)
    })
  })
})
