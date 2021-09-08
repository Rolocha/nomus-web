import { app } from 'src/app'
import { User } from 'src/models'
import { cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { SendgridTemplate, sgMail } from 'src/util/sendgrid'
import { stripe } from 'src/util/stripe'
import { createMockNomusProSubscription } from 'src/__mocks__/models/NomusProSubscription'
import { createMockUser } from 'src/__mocks__/models/User'
import request from 'supertest'

// NOTE: No need to initDB in this test bc the src/app import initializes it
afterAll(async () => {
  await cleanUpDB()
})

afterEach(async () => {
  await dropAllCollections()
})

describe('NomusProInvoicePaymentFailed Stripe webhook handler', () => {
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

  it('sends an email to the user notifying them their payment failed', async () => {
    const user = await createMockUser()
    await createMockNomusProSubscription({
      user: user.id,
      stripeSubscription: 'sub_1234',
    })

    const stripeChargeMock = {
      /* eslint-disable camelcase */
      id: 'ch_1234',
      payment_method_details: {
        card: {
          last4: '5432',
        },
      },
      /* eslint-enable camelcase */
    }
    // @ts-ignore we don't need to mock all the properties of a Subscription
    jest.spyOn(stripe.charges, 'retrieve').mockResolvedValue(stripeChargeMock)

    const checkoutPortalSessionMock = {
      url: 'checkout.portal.session.url',
    }
    // @ts-ignore we don't need to mock all the properties of a Billing Portal session
    jest.spyOn(stripe.billingPortal.sessions, 'create').mockResolvedValue(checkoutPortalSessionMock)

    const sendMailSpy = jest.spyOn(sgMail, 'send').mockReturnValue(null)

    await agent
      .post('/api/stripehooks')
      .send({
        /* eslint-disable camelcase */
        type: 'invoice.payment_failed',
        data: {
          object: {
            id: 'invoice.id',
            subscription: 'sub_1234',
            charge: 'ch_1234',
            total: 501,
          },
        },
        /* eslint-enable camelcase */
      })
      .set('Accept', 'application/json')
      .expect(200)

    expect(sendMailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: user.email,
        templateId: SendgridTemplate.NomusProPaymentFailed,
        dynamicTemplateData: {
          firstName: user.name.first,
          chargeAmount: 501,
          cardLast4: '5432',
          checkoutPortalLink: checkoutPortalSessionMock.url,
        },
      })
    )
  })
})
