import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { createMockCard } from 'src/__mocks__/models/Card'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockSheet } from 'src/__mocks__/models/Sheet'
import { createMockUser } from 'src/__mocks__/models/User'
import { getCardDataForInteractionString } from './cardRouter'
import { CardInteractionType } from './enums'
import { NamedError } from './error'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('getCardDataForInteractionString', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  it('fails incorrectly formatted routeStr, miss-spelled', async () => {
    const badRoute = 'sheet_jsdldnfskl-card_fsfljs'
    const result = await getCardDataForInteractionString(badRoute)
    expect(result.isSuccess).toBeFalsy()
    expect(result.error).toEqual(new NamedError(`Incorrectly formatted routeStr: ${badRoute}`))
  })

  it('properly parses a linked tap (NFC) URL', async () => {
    const user = await createMockUser()
    const cardVersion = await createMockCardVersion({ user: user.id })
    const card = await createMockCard({ cardVersion: cardVersion.id, user: user.id })
    const sheet = await createMockSheet({ cards: [card] })

    const routeStr = [sheet.id, card.id].join('-')
    const result = await getCardDataForInteractionString(routeStr)

    expect(result.value.card.id).toStrictEqual(card.id)
    expect(result.value.cardVersion.id).toStrictEqual(cardVersion.id)
    expect(result.value.interactionType).toStrictEqual(CardInteractionType.Tap)
    expect(result.value.cardUser.username).toStrictEqual(user.username)
  })

  it('properly parses an un-linked tap (NFC) URL', async () => {
    const card = await createMockCard({ cardVersion: null, user: null })
    const sheet = await createMockSheet({ cards: [card] })

    const routeStr = [sheet.id, card.id].join('-')
    const result = await getCardDataForInteractionString(routeStr)

    expect(result.value.card.id).toStrictEqual(card.id)
    expect(result.value.cardVersion).toStrictEqual(null)
    expect(result.value.interactionType).toStrictEqual(CardInteractionType.Tap)
    expect(result.value.cardUser).toStrictEqual(null)
  })

  it('properly parses a QR scan URL with a cardVersionId', async () => {
    const user = await createMockUser()
    const cardVersion = await createMockCardVersion({ user: user.id })
    const routeStr = cardVersion.id

    const result = await getCardDataForInteractionString(routeStr)
    expect(result.value.card).toStrictEqual(null)
    expect(result.value.cardVersion.id).toStrictEqual(cardVersion.id)
    expect(result.value.interactionType).toStrictEqual(CardInteractionType.QRCode)
    expect(result.value.cardUser.id).toStrictEqual(user.id)
  })

  it('properly parses a QR scan URL with an userId', async () => {
    const user = await createMockUser()

    const routeStr = user.id
    const result = await getCardDataForInteractionString(routeStr)

    expect(result.value.card).toStrictEqual(null)
    expect(result.value.cardVersion).toStrictEqual(null)
    expect(result.value.interactionType).toStrictEqual(CardInteractionType.QRCode)
    expect(result.value.cardUser.username).toStrictEqual(user.username)
  })
})
