import { initDB, cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('CardVersionResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('cardVersion', () => {
    it("when neither user nor card version specified, resolves the context user's default card version", async () => {
      const user = await createMockUser()
      const cardVersion = await createMockCardVersion({
        user: user._id,
      })
      user.defaultCardVersion = cardVersion._id
      await user.save()

      const response = await execQuery({
        source: `
        query CardVersionTestQuery {
          cardVersion {
            id
          }
        }
        `,
        contextUser: user,
      })

      expect(response.data?.cardVersion?.id).toBe(cardVersion.id)
    })
  })

  describe('cardVersions', () => {
    it('when neither user nor card version specified, resolves with all card versions belonging to the context user', async () => {
      const user = await createMockUser()
      const cardVersions = [
        await createMockCardVersion({ user: user._id }),
        await createMockCardVersion({ user: user._id }),
        await createMockCardVersion({ user: user._id }),
      ]

      user.defaultCardVersion = cardVersions[0]
      await user.save()

      const response = await execQuery({
        source: `
        query CardVersionsTestQuery {
          cardVersions {
            id
          }
        }
        `,
        contextUser: user,
      })

      // Verify the length of the returned card versions list
      expect(response.data?.cardVersions).toHaveLength(cardVersions.length)
      // Verify that the ids of the returned card versions line up with the ones we created earlier
      expect(response.data?.cardVersions).toEqual(
        expect.arrayContaining(
          cardVersions.map((cardVersion) =>
            expect.objectContaining({
              id: cardVersion.id as string,
            })
          )
        )
      )
    })
  })

  describe('updateCardVersion', () => {
    it('updates a cardVersion frontImageUrl', async () => {
      const cardVersion = await createMockCardVersion()
      const testUrl = 'https://good-url'

      const response = await execQuery({
        source: `
          mutation UpdateCardVersionTestQuery($payload: CardVersionQueryInput!) {
            updateCardVersion(payload: $payload) {
              id,
              frontImageUrl,
              backImageUrl,
            }
          }
        `,
        variableValues: {
          payload: {
            id: cardVersion.id,
            frontImageUrl: testUrl,
            backImageUrl: testUrl,
          },
        },
      })

      expect(response.data?.updateCardVersion).toMatchObject({
        id: cardVersion.id,
        frontImageUrl: testUrl,
        backImageUrl: testUrl,
      })
    })
  })

  describe('cardVersionsStats', () => {
    it('when neither user nor card versions specified, resolves with stats for all card versions belonging to the context user', async () => {
      const user = await createMockUser()
      const cardVersions = [
        await createMockCardVersion({ user: user._id }),
        await createMockCardVersion({ user: user._id }),
        await createMockCardVersion({ user: user._id }),
      ]

      user.defaultCardVersion = cardVersions[0]
      await user.save()

      const response = await execQuery({
        source: `
        query CardVersionsStatsTestQuery {
          cardVersionsStats {
            id
            numCardsOrdered
            numTaps
          }
        }
        `,
        contextUser: user,
      })

      // Verify the length of the returned card versions list
      expect(response.data?.cardVersionsStats).toHaveLength(cardVersions.length)
      // Verify that the ids of the returned card versions line up with the ones we created earlier
      expect(response.data?.cardVersionsStats).toEqual(
        expect.arrayContaining(
          cardVersions.map((cardVersion) =>
            expect.objectContaining({
              id: cardVersion.id as string,
              numCardsOrdered: expect.any(Number),
              numTaps: expect.any(Number),
            })
          )
        )
      )
    })
  })
})
