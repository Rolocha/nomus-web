import request from 'supertest'
import { app } from 'src/app'
import { createMockUser } from 'src/__mocks__/models/User'
import { cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import vcf from 'vcf'
import { User } from 'src/models'
import { createMockConnection } from 'src/__mocks__/models/Connection'
// import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from 'src/config'

// NOTE: No need to initDB in this test bc the src/app import initializes it
afterAll(async () => {
  await cleanUpDB()
})

afterEach(async () => {
  await dropAllCollections()
})

describe('GET /vcf/:username', () => {
  let mockUser: User
  beforeEach(async () => {
    mockUser = await createMockUser({
      name: {
        first: 'Mario',
        middle: 'the',
        last: 'Plumber',
      },
      username: 'mario',
      email: 'mario@plumbing.com',
      password: 'i-h8-bowser',
      phoneNumber: '1234567890',
      headline: 'Koopa Assassin',
    })
  })

  it('responds with a 404 if no user with that username exists', async () => {
    const response = await request(app).get('/api/contact/vcf/nobody')
    expect(response.status).toBe(404)
    expect(response.body.message).toMatch(/No user with the username/)
  })

  it('responds with a VCF file with the expected data', async () => {
    const response = await request(app).get(`/api/contact/vcf/${mockUser.username}`)
    expect(response.status).toBe(200)
    const vcfData = new vcf().parse(response.text).data
    expect(vcfData.n.valueOf()).toBe(
      // VCF name field seems to include two other name parts (prefix and  suffix?) that we don't hence the two empty strings
      [mockUser.name.last, mockUser.name.first, mockUser.name.middle, '', ''].join(';')
    )
    expect(vcfData.email.valueOf()).toBe(mockUser.email)
    expect(vcfData.tel.valueOf()).toBe(mockUser.phoneNumber)
    expect(vcfData.fn.valueOf()).toBe(
      [mockUser.name.first, mockUser.name.middle, mockUser.name.last].join(' ')
    )
    expect(vcfData.title.valueOf()).toBe(mockUser.headline)
    expect(vcfData.url.valueOf()).toBe(`https://nomus.me/${mockUser.username}`)
    expect(vcfData.url.valueOf()).toBe(`https://nomus.me/${mockUser.username}`)
  })

  describe('logged in scenarios', () => {
    let requestingUser: User
    let agent: request.SuperAgentTest

    // Create a user and log in using an agent that the it() blocks will also use
    // in order to preserve access token cookie
    beforeEach(async (done) => {
      requestingUser = await createMockUser({
        password: 'foobar',
      })
      agent = request.agent(app)
      await agent.post('/auth/login').send({
        email: requestingUser.email,
        password: 'foobar',
      })
      done()
    })

    it('includes in VCF.note the details from the Connection object if present', async () => {
      const connection = await createMockConnection({
        from: requestingUser.id,
        to: mockUser.id,
        meetingDate: '1980-01-01',
        meetingPlace: 'Connection place',
        tags: ['connection', 'tags'],
        notes: 'Connection note',
      })

      const response = await agent.get(`/api/contact/vcf/${mockUser.username}`)
      expect(response.status).toBe(200)
      const vcfData = new vcf().parse(response.text).data
      const vcfNoteField = vcfData.note.valueOf() as string
      // HACK: vcf lib parses newlines in this weird way
      const vcfNoteFieldLines = vcfNoteField.split('\\n')
      expect(vcfNoteFieldLines).toEqual(
        expect.arrayContaining([
          `Meeting Date: ${connection.meetingDate}`,
          `Meeting Place: ${connection.meetingPlace}`,
          // HACK: vcf lib parses commas in this weird way
          `Tags: ${connection.tags.join('\\,')}`,
          `Additional notes:`,
          connection.notes,
        ])
      )
    })

    it('includes in VCF.note the connection details from query params, overriding details from Connection object', async () => {
      const requestingUser = await createMockUser()
      await createMockConnection({
        from: requestingUser.id,
        to: mockUser.id,
        meetingDate: '1980-01-01',
        meetingPlace: 'Connection place',
        tags: ['connection', 'tags'],
        notes: 'Connection note',
      })

      const searchParams = {
        meetingDate: '2020-01-01',
        meetingPlace: 'GameBoy Advance SP',
        tags: 'video games,fun',
        notes: 'Loved playing Mario as a kid',
      }
      const urlSearchParams = new URLSearchParams(searchParams)

      const response = await agent.get(
        `/api/contact/vcf/${mockUser.username}?${urlSearchParams.toString()}`
      )
      expect(response.status).toBe(200)
      const vcfData = new vcf().parse(response.text).data
      const vcfNoteField = vcfData.note.valueOf() as string
      // HACK: vcf lib parses newlines in this weird way
      const vcfNoteFieldLines = vcfNoteField.split('\\n')
      expect(vcfNoteFieldLines).toEqual(
        expect.arrayContaining([
          `Meeting Date: ${searchParams.meetingDate}`,
          `Meeting Place: ${searchParams.meetingPlace}`,
          // HACK: vcf lib parses commas in this weird way
          `Tags: ${searchParams.tags.split(',').join('\\,')}`,
          `Additional notes:`,
          searchParams.notes,
        ])
      )
    })
  })
})
