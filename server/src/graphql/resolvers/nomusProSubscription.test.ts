import { NOMUS_PRO_PRICE_ID } from 'src/graphql/resolvers/nomusProSubscription'
import { NomusProSubscription } from 'src/models'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { BillableProduct, NomusProFeature } from 'src/util/enums'
import { stripe } from 'src/util/stripe'
import { createMockNomusProSubscription } from 'src/__mocks__/models/NomusProSubscription'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('NomusProSubscription resolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('nomusProAccessInfo', () => {
    it('responds with the access info', async () => {
      const user = await createMockUser()
      const sub = await createMockNomusProSubscription({ user: user.id })

      const response = await execQuery({
        source: `
            query TestQuery {
                nomusProAccessInfo {
                    id
                    hasAccessUntil
                    featureSet {
                        UseCustomTapLink
                    }
                }
            }
        `,
        contextUser: user,
      })

      expect(response.errors).toBeUndefined()
      expect(response.data?.nomusProAccessInfo).toMatchObject({
        id: sub.id,
        hasAccessUntil: sub.currentPeriodEndsAt,
        featureSet: {
          [NomusProFeature.UseCustomTapLink]: false,
        },
      })
    })
  })

  describe('updateNomusProFeatureSet', () => {
    it('updates the custom link routing feature enabled status', async () => {
      const user = await createMockUser()
      const sub = await createMockNomusProSubscription({ user: user.id })

      expect(sub.featureSet.UseCustomTapLink).toBe(false)

      const response = await execQuery({
        source: `
            mutation TestMutation($featureSetUpdate: UpdateNomusProFeatureSetInput!) {
                updateNomusProFeatureSet(featureSetUpdate: $featureSetUpdate) {
                    id
                    hasAccessUntil
                    featureSet {
                        UseCustomTapLink
                    }   
                }
            }
        `,
        variableValues: {
          featureSetUpdate: {
            [NomusProFeature.UseCustomTapLink]: true,
          },
        },
        contextUser: user,
      })

      expect(response.errors).toBeUndefined()
      expect(
        response.data?.updateNomusProFeatureSet?.featureSet[NomusProFeature.UseCustomTapLink]
      ).toBe(true)
      const updatedSub = await NomusProSubscription.mongo.findById(sub.id)
      expect(updatedSub.featureSet[NomusProFeature.UseCustomTapLink]).toBe(true)
    })
  })

  describe('createNomusProCheckoutSession', () => {
    it('calls stripe.checkout.sessions.create with the right arguments', async () => {
      const user = await createMockUser()

      const createSessionSpy = jest
        .spyOn(stripe.checkout.sessions, 'create')
        .mockResolvedValueOnce({
          // @ts-ignore
          url: 'checkout.session.url',
        })
      const response = await execQuery({
        source: `
            mutation TestMutation($triggerFeature: NomusProFeature) {
                createNomusProCheckoutSession(triggerFeature: $triggerFeature) {
                    url
                }
            }
        `,
        variableValues: {
          triggerFeature: NomusProFeature.UseCustomTapLink,
        },
        contextUser: user,
      })

      expect(response.errors).toBeUndefined()
      expect(response.data.createNomusProCheckoutSession.url).toBe('checkout.session.url')
      expect(createSessionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          /* eslint-disable camelcase */
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: expect.arrayContaining([
            expect.objectContaining({
              price: NOMUS_PRO_PRICE_ID,
              quantity: 1,
            }),
          ]),
          success_url: expect.stringContaining(
            '/dashboard/profile?session_id={CHECKOUT_SESSION_ID}&completedNomusProSubscription'
          ),
          cancel_url: expect.stringContaining(
            '/dashboard/profile?session_id={CHECKOUT_SESSION_ID}&canceledNomusProSubscription'
          ),
          customer_email: user.email,
          metadata: {
            userId: user.id,
            triggerFeature: NomusProFeature.UseCustomTapLink,
            billableProduct: BillableProduct.NomusPro,
          },
          /* eslint-enable camelcase */
        })
      )
    })
  })
})
