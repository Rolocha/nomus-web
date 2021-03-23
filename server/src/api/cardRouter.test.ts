import request from 'supertest'
import { app } from 'src/app'
import { cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { createMockCard } from 'src/__mocks__/models/Card'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockSheet } from 'src/__mocks__/models/Sheet'
import { createMockUser } from 'src/__mocks__/models/User'

// NOTE: No need to initDB in this test bc the src/app import initializes it
afterAll(async () => {
  await cleanUpDB()
})

afterEach(async () => {
  await dropAllCollections()
})

describe('GET /d/:nfcId', () => {
  it('responds with a contact page if linked', async () => {
    const user = await createMockUser()
    const cardVersion = await createMockCardVersion({ user: user.id })
    const card = await createMockCard({ cardVersion: cardVersion.id, user: user.id })
    const sheet = await createMockSheet({ cards: [card] })
    const routeStr = [sheet.id, card.id].join('-')

    const response = await request(app).get(`/d/${routeStr}`)

    expect(response.status).toBe(307)
    expect(response.headers.location).toBe(`/${user.username}`)
  })

  it('responds with a contact page if linked', async () => {
    const card = await createMockCard({ cardVersion: null, user: null })
    const sheet = await createMockSheet({ cards: [card] })
    const routeStr = [sheet.id, card.id].join('-')

    const response = await request(app).get(`/d/${routeStr}`)

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe(`/admin/linker/${routeStr}`)
  })

  it('fails if the card does not exist', async () => {
    const routeStr = 'sheet_5f9caf5ec9b90b8674941cc5-card_5f9caf5ec9b90b8674941ccd'

    const response = await request(app).get(`/d/${routeStr}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('invalid-card-id')
  })

  it('fails if the routeStr is improperly formatted', async () => {
    // missing last 3 digits
    const routeStr = 'sheet_5f9caf5ec9b90b8674941cc5-card_5f9caf5ec9b90b8674941'

    const response = await request(app).get(`/d/${routeStr}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('invalid-card-id')
  })
})
