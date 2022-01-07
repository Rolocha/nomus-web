import { DateTime } from 'luxon'
import { app } from 'src/app'
import { Order, User } from 'src/models'
import { cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { OrderState } from 'src/util/enums'
import * as Slack from 'src/util/slack'
import { stripe } from 'src/util/stripe'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockUser } from 'src/__mocks__/models/User'
import request from 'supertest'

jest.mock('src/util/shipment')
jest.mock('src/util/slack')

// NOTE: No need to initDB in this test bc the src/app import initializes it
afterAll(async () => {
  await cleanUpDB()
})

afterEach(async () => {
  await dropAllCollections()
})

describe('HandleShippoTrackUpdated Shippo webhook handler', () => {
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

  it('updates the order tracking status/eta, sends email if needed, and posts a Slack message', async () => {
    const order = await createMockOrder({
      state: OrderState.Captured,
      shippoTransactionId: 'transaction_id',
    })

    const mockEventData = {
      /* eslint-disable camelcase */
      transaction: 'transaction_id',
      tracking_status: {
        status: 'TRANSIT',
        substatus: 'out_for_delivery',
      },
      eta: DateTime.now().plus({ days: 7 }).toISOTime(),
      /* eslint-enable camelcase */
    }

    const slackSpy = jest.spyOn(Slack, 'postSimpleMarkdownMessage').mockResolvedValue(null)

    await agent
      .post('/api/shippohooks')
      .send({
        event: 'track_updated',
        data: mockEventData,
      })
      .set('Accept', 'application/json')
      .expect(200)

    const updatedOrder = await Order.mongo.findById(order.id)

    expect(updatedOrder.lastShippoTrackingStatus).toMatchObject(mockEventData.tracking_status)
    expect(updatedOrder.shipmentEta).toBe(mockEventData.eta)
    expect(updatedOrder.notifiedShipped).toBe(true)

    expect(slackSpy).toHaveBeenCalledWith({
      channel: Slack.Channel.Orders,
      text: expect.stringContaining('Status: TRANSIT'),
    })
  })
})
