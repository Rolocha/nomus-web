import { stripehookHandlers, StripehookScenario } from 'src/api/stripehooks'
import { app } from 'src/app'
import { User } from 'src/models'
import { cleanUpDB, dropAllCollections } from 'src/test-utils/db'
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

describe('Stripe webhook router', () => {
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

  it('routes to the CardOrderCheckoutCompleted handler when appropriate', async () => {
    const handler = (stripehookHandlers[StripehookScenario.CardOrderCheckoutCompleted] = jest.fn())

    await agent.post('/api/stripehooks').send({
      type: 'checkout.session.completed',
      data: {
        object: {
          mode: 'payment',
        },
      },
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('routes to the NomusProCheckoutCompleted handler when appropriate', async () => {
    const handler = (stripehookHandlers[StripehookScenario.NomusProCheckoutCompleted] = jest.fn())

    await agent.post('/api/stripehooks').send({
      type: 'checkout.session.completed',
      data: {
        object: {
          mode: 'subscription',
        },
      },
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('routes to the NomusProInvoicePaid handler when appropriate', async () => {
    const handler = (stripehookHandlers[StripehookScenario.NomusProInvoicePaid] = jest.fn())

    await agent.post('/api/stripehooks').send({
      type: 'invoice.paid',
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('routes to the NomusProInvoicePaymentFailed handler when appropriate', async () => {
    const handler = (stripehookHandlers[
      StripehookScenario.NomusProInvoicePaymentFailed
    ] = jest.fn())

    await agent.post('/api/stripehooks').send({
      type: 'invoice.payment_failed',
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })
})
