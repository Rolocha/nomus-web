import { app } from 'src/app'
import { NomusProSubscription, Order, User } from 'src/models'
import { cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { OrderState } from 'src/util/enums'
import { stripe } from 'src/util/stripe'
import { createMockNomusProSubscription } from 'src/__mocks__/models/NomusProSubscription'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockUser } from 'src/__mocks__/models/User'
import request from 'supertest'

// NOTE: No need to initDB in this test bc the src/app import initializes it
afterAll(async () => {
  await cleanUpDB()
})

afterEach(async () => {
  await dropAllCollections()
})

describe('InvoicePaid Stripe webhook handler', () => {
  let requestingUser: User
  let agent: request.SuperAgentTest
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

  it("updates the start/end times on the NomusProSubscription associated with the invoice's Stripe Subscription", async () => {
    const user = await createMockUser()
    const now = Date.now() * 1000
    const yesterday = now - 60 * 60 * 24
    const oneMonthAgo = now - 60 * 60 * 24 * 30
    const oneMonthFromNow = now + 60 * 60 * 24 * 30
    await createMockNomusProSubscription({
      user: user.id,
      stripeSubscription: 'sub_1234',
      currentPeriodStartsAt: oneMonthAgo,
      currentPeriodEndsAt: yesterday,
    })

    const stripeSubscriptionMock = {
      /* eslint-disable camelcase */
      id: 'sub_1234',
      current_period_start: now,
      current_period_end: oneMonthFromNow,
      /* eslint-enable camelcase */
    }
    // @ts-ignore we don't need to mock all the properties of a Subscription
    jest.spyOn(stripe.subscriptions, 'retrieve').mockResolvedValue(stripeSubscriptionMock)

    await agent
      .post('/api/stripehooks')
      .send({
        /* eslint-disable camelcase */
        type: 'invoice.paid',
        data: {
          object: {
            id: 'invoice.id',
            subscription: 'sub_1234',
          },
        },
        /* eslint-enable camelcase */
      })
      .set('Accept', 'application/json')
      .expect(200)

    const updatedNps = await NomusProSubscription.mongo.findOne({ user: user.id })
    expect(updatedNps).toBeDefined()
    expect(updatedNps.currentPeriodStartsAt).toBe(now)
    expect(updatedNps.currentPeriodEndsAt).toBe(oneMonthFromNow)
  })

  it('updates and transitions a paid order once the invoice is paid', async () => {
    const user = await createMockUser()
    const order = await createMockOrder({
      user: user.id,
      paymentIntent: 'pi_1234',
      state: OrderState.Captured,
    })

    await agent
      .post('/api/stripehooks')
      .send({
        /* eslint-disable camelcase */
        type: 'invoice.paid',
        data: {
          object: {
            id: 'invoice.id',
            payment_intent: {
              id: 'pi_1234',
            },
          },
        },
        /* eslint-enable camelcase */
      })
      .set('Accept', 'application/json')
      .expect(200)

    const updatedOrder = await Order.mongo.findById(order.id)
    expect(updatedOrder.state).toBe(OrderState.Paid)
  })
})
