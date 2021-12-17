import { app } from 'src/app'
import { Order, User } from 'src/models'
import { cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { OrderState } from 'src/util/enums'
import { formatName } from 'src/util/name'
import { getCostSummary } from 'src/util/pricing'
import * as ShipmentModule from 'src/util/shipment'
import { stripe } from 'src/util/stripe'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockUser } from 'src/__mocks__/models/User'
import request from 'supertest'
import { mocked } from 'ts-jest/utils'

jest.mock('src/util/shipment')
const mockedShipmentModule = mocked(ShipmentModule)

// NOTE: No need to initDB in this test bc the src/app import initializes it
afterAll(async () => {
  await cleanUpDB()
})

afterEach(async () => {
  await dropAllCollections()
})

describe('CardOrderCheckoutCompleted Stripe webhook handler', () => {
  let requestingUser: User
  let agent: request.SuperAgentTest
  const mockedShippoTransaction = {
    trackingNumber: '1234',
    id: 'id_123',
    labelUrl: 'label_dot_com',
  }
  beforeEach(() => {
    mockedShipmentModule.createShippoTransaction.mockResolvedValue(mockedShippoTransaction)
  })

  beforeEach(async (done) => {
    // Create a user and log in using an agent that the it() blocks will also use
    // in order to preserve access token cookie
    requestingUser = await createMockUser({
      password: 'foobar',
    })
    agent = request.agent(app)
    await agent.post('/auth/login').send({
      email: requestingUser.email,
      password: 'foobar',
    })

    jest.spyOn(stripe.webhooks, 'constructEvent').mockImplementation((e: any) => e)
    done()
  })

  it('updates the order with the new cost/shipping details', async () => {
    const costSummary = getCostSummary(25)
    const order = await createMockOrder({
      state: OrderState.Captured,
      quantity: 25,
      price: {
        subtotal: costSummary.subtotal,
        tax: costSummary.estimatedTaxes,
        shipping: costSummary.shipping,
        discount: costSummary.discount,
        total: costSummary.total,
      },
      shippingLabelUrl: undefined,
      shippoTransactionId: undefined,
      trackingNumber: undefined,
    })

    // Pretend the updated price data we'll get from Stripe
    // corresponds to a CA-based customer
    const costSummaryInCali = getCostSummary(25, 'CA')
    // And make sure it's non-zero taxes to ensure this test is
    // actually doing something
    expect(costSummaryInCali.estimatedTaxes).toBeGreaterThan(0)

    const mockEventData = {
      /* eslint-disable camelcase */
      object: {
        mode: 'payment',
        metadata: {
          orderId: order.id,
        },
        amount_subtotal: costSummaryInCali.subtotal,
        total_details: {
          amount_tax: costSummaryInCali.estimatedTaxes,
          amount_discount: costSummaryInCali.discount,
        },
        amount_total: costSummaryInCali.total,
        shipping: {
          name: 'Bibek Ghimire',
          address: {
            line1: '123 Main St',
            line2: null,
            city: 'San Francisco',
            state: 'CA',
            postal_code: '94103',
          },
        },
      },
      /* eslint-enable camelcase */
    }

    await agent
      .post('/api/stripehooks')
      .send({
        type: 'checkout.session.completed',
        data: mockEventData,
      })
      .set('Accept', 'application/json')
      .expect(200)

    const updatedOrder = await Order.mongo.findById(order.id)

    expect(updatedOrder.shippingName).toBe('Bibek Ghimire')
    expect(updatedOrder.shippingAddress).toMatchObject({
      line1: '123 Main St',
      line2: null,
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
    })
    expect(updatedOrder.price).toMatchObject({
      subtotal: costSummaryInCali.subtotal,
      tax: costSummaryInCali.estimatedTaxes,
      shipping: costSummaryInCali.shipping,
      discount: costSummaryInCali.discount,
      total: costSummaryInCali.total,
    })
    expect(updatedOrder.trackingNumber).toBe(mockedShippoTransaction.trackingNumber)
    expect(updatedOrder.shippoTransactionId).toBe(mockedShippoTransaction.id)
    expect(updatedOrder.shippingLabelUrl).toBe(mockedShippoTransaction.labelUrl)
  })
})
