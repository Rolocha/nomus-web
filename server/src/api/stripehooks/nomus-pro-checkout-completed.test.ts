import { app } from 'src/app'
import { NomusProSubscription, User } from 'src/models'
import { cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { NomusProFeature } from 'src/util/enums'
import { stripe } from 'src/util/stripe'
import { createMockUser } from 'src/__mocks__/models/User'
import request from 'supertest'

// NOTE: No need to initDB in this test bc the src/app import initializes it
afterAll(async () => {
  await cleanUpDB()
})

afterEach(async () => {
  await dropAllCollections()
})

describe('NomusProCheckoutCompleted Stripe webhook handler', () => {
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

  it('creates a NomusProSubscription for the user', async () => {
    const user = await createMockUser()

    const stripeSubscriptionMock = {
      /* eslint-disable camelcase */
      id: 'sub_1234',
      current_period_start: 0,
      current_period_end: Date.now() / 1000 + 100000,
      /* eslint-enable camelcase */
    }
    // @ts-ignore we don't need to mock all the properties of a Subscription
    jest.spyOn(stripe.subscriptions, 'retrieve').mockResolvedValue(stripeSubscriptionMock)

    await agent
      .post('/api/stripehooks')
      .send({
        /* eslint-disable camelcase */
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'checkout.session.id',
            mode: 'subscription',
            subscription: 'sub_1234',
            metadata: {
              userId: user.id,
              triggerFeature: NomusProFeature.UseCustomTapLink,
            },
          },
        },
        /* eslint-enable camelcase */
      })
      .set('Accept', 'application/json')
      .expect(200)

    const nps = await NomusProSubscription.mongo.findOne({ user: user.id })
    expect(nps).toBeDefined()
    expect(nps.originalCheckoutSession).toBe('checkout.session.id')
    expect(nps.stripeSubscription).toBe('sub_1234')
    expect(nps.currentPeriodStartsAt).toBe(stripeSubscriptionMock.current_period_start)
    expect(nps.currentPeriodEndsAt).toBe(stripeSubscriptionMock.current_period_end)
    expect(nps.featureSet.UseCustomTapLink).toBe(true)
  })
})
