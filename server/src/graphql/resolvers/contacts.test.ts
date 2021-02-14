import { DocumentType } from '@typegoose/typegoose'
import { PersonName } from 'src/models/subschemas'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockConnection } from 'src/__mocks__/models/Connection'
import { createMockUser } from 'src/__mocks__/models/User'
import { Role } from 'src/util/enums'
import { Connection } from 'src/models'
import { getCurrentDateForDateInput } from 'shared/utils/date'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('ContactsResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('contacts query', () => {
    it("gets user's connections", async () => {
      const userFrom = await createMockUser()
      const userTo1 = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })
      const userTo2 = await createMockUser({
        name: { first: 'Another', middle: 'Such', last: 'Person' },
        email: 'person2@greendale.com',
        password: 'save-greendale',
      })
      const connection1 = await createMockConnection({ from: userFrom._id, to: userTo1._id })
      const connection2 = await createMockConnection({ from: userFrom._id, to: userTo2._id })

      const response = await execQuery({
        source: `
        query ContactsTestQuery {
          contacts {
            id
            name {
              first
              middle
              last
            }
            phoneNumber
            email
            notes
            cardFrontImageUrl
            cardBackImageUrl
            vcfUrl
          }
        }
        `,
        contextUser: userFrom,
      })

      const expectedData = [
        {
          id: userTo1.id,
          name: (userTo1.name as DocumentType<PersonName>).toObject(),
          notes: connection1.notes ?? null,
          phoneNumber: userTo1.phoneNumber ?? null,
          email: userTo1.email,
          cardFrontImageUrl: null,
          cardBackImageUrl: null,
          vcfUrl: userTo1.vcfUrl ?? null,
        },
        {
          id: userTo2.id,
          name: (userTo2.name as DocumentType<PersonName>).toObject(),
          notes: connection2.notes ?? null,
          phoneNumber: userTo2.phoneNumber ?? null,
          email: userTo2.email,
          cardFrontImageUrl: null,
          cardBackImageUrl: null,
          vcfUrl: userTo2.vcfUrl ?? null,
        },
      ]

      expect(response.data?.contacts).toMatchObject(expectedData)
    })

    it('returns an empty list if no connections exists', async () => {
      const userFrom = await createMockUser()

      const response = await execQuery({
        source: `
        query ContactsTestQuery {
          contacts {
            id
            name {
              first
              middle
              last
            }
            phoneNumber
            email
            notes
            cardFrontImageUrl
            cardBackImageUrl
            vcfUrl
          }
        }
        `,
        contextUser: userFrom,
      })

      expect(response.data?.contacts?.length).toBe(0)
    })

    it("doesn't let non-admins query a specific userId", async () => {
      const userFrom = await createMockUser()
      const userTo = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })

      const response = await execQuery({
        source: `
        query ContactsTestQuery($userId: String!) {
          contacts(userId: $userId) {
            id
            name {
              first
              middle
              last
            }
            phoneNumber
            email

            cardFrontImageUrl
            cardBackImageUrl
            vcfUrl

            meetingDate
            meetingPlace
            notes
          }
        }
        `,
        variableValues: {
          userId: userTo.id,
        },
        contextUser: userFrom,
      })
      expect(response.errors[0].message).toContain('denied!')
    })

    it("lets admins query other user's connections", async () => {
      const userAdmin = await createMockUser({ roles: [Role.User, Role.Admin] })
      const userFrom = await createMockUser({
        name: { first: 'Annie', middle: 'Allison', last: 'Edison' },
        email: 'goody2shoes@greendale.com',
        password: 'save-greendale',
      })
      const userTo = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })
      const connection = await createMockConnection({ from: userFrom._id, to: userTo._id })

      const response = await execQuery({
        source: `
        query ContactsTestQuery($userId: String!) {
          contacts(userId: $userId) {
            id
            name {
              first
              middle
              last
            }
            phoneNumber
            email
            
            cardFrontImageUrl
            cardBackImageUrl
            vcfUrl

            meetingDate
            meetingPlace
            notes
          }
        }
        `,
        variableValues: {
          userId: userFrom.id,
        },
        contextUser: userAdmin,
      })

      const expectedData = [
        {
          id: userTo.id,
          name: (userTo.name as DocumentType<PersonName>).toObject(),
          notes: connection.notes ?? null,
          phoneNumber: userTo.phoneNumber ?? null,
          email: userTo.email,
          cardFrontImageUrl: null,
          cardBackImageUrl: null,
          vcfUrl: userTo.vcfUrl ?? null,
        },
      ]

      expect(response.data?.contacts).toMatchObject(expectedData)
    })
  })
  describe('publicContact query', () => {
    it('gets a user contact where connection exists', async () => {
      const userFrom = await createMockUser()
      const userTo = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })
      const meetingDate = new Date().toISOString().substr(0, 10)
      const connection = await createMockConnection({
        from: userFrom._id,
        to: userTo._id,
        meetingDate,
        meetingPlace: 'there',
        notes: 'foo',
      })

      const response = await execQuery({
        source: `
        query PublicContactTestQuery($username: String!) {
          publicContact(username: $username) {
            id
            name {
              first
              middle
              last
            }
            phoneNumber
            email
            
            cardFrontImageUrl
            cardBackImageUrl
            vcfUrl

            meetingDate
            meetingPlace
            notes
            connected
          }
        }
        `,
        variableValues: {
          username: userTo.username,
        },
        contextUser: userFrom,
      })

      const expectedData = {
        id: userTo.id,
        name: (userTo.name as DocumentType<PersonName>).toObject(),
        phoneNumber: userTo.phoneNumber ?? null,
        email: userTo.email,
        cardFrontImageUrl: null,
        cardBackImageUrl: null,
        vcfUrl: userTo.vcfUrl ?? null,
        notes: connection.notes ?? null,
        meetingDate,
        meetingPlace: connection.meetingPlace,
        connected: true,
      }

      expect(response.data?.publicContact).toMatchObject(expectedData)
    })

    it('creates a new connection if none exists', async () => {
      const userFrom = await createMockUser()
      const userTo = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })

      expect(await Connection.mongo.findOne({ from: userFrom.id, to: userTo.id })).toBeNull()

      const response = await execQuery({
        source: `
        query PublicContactTestQuery($username: String!) {
          publicContact(username: $username) {
            id
            name {
              first
              middle
              last
            }
            phoneNumber
            email
            
            cardFrontImageUrl
            cardBackImageUrl
            vcfUrl

            meetingDate
            meetingPlace
            notes
            connected
          }
        }
        `,
        variableValues: {
          username: userTo.username,
        },
        contextUser: userFrom,
      })

      expect(response.data?.publicContact).toMatchObject({
        id: userTo.id,
        name: (userTo.name as DocumentType<PersonName>).toObject(),
        phoneNumber: userTo.phoneNumber ?? null,
        email: userTo.email,
        cardFrontImageUrl: null,
        cardBackImageUrl: null,
        vcfUrl: userTo.vcfUrl ?? null,
        meetingDate: getCurrentDateForDateInput(),
        connected: true,
      })
      expect(await Connection.mongo.findOne({ from: userFrom.id, to: userTo.id })).not.toBeNull()
    })
  })

  describe('saveContact mutation', () => {
    it('saves a contact and associated notes to a connection', async () => {
      const userA = await createMockUser({
        username: 'user_a',
      })
      const userB = await createMockUser({
        username: 'user_b',
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })

      const response = await execQuery({
        source: `
        mutation ContactTestQuery($username: String!, $contactInfo: ContactInfoInput) {
          saveContact(username: $username, contactInfo: $contactInfo) {
            id
            meetingDate
            meetingPlace
            notes
          }
        }
        `,
        variableValues: {
          username: userB.username,
          contactInfo: {
            meetingDate: '2020-01-01',
            meetingPlace: 'UCLA',
            notes: 'more notes',
          },
        },
        contextUser: userA,
      })

      const connection = await Connection.mongo.findOne({
        from: userA._id,
        to: userB._id,
      })

      expect(connection).not.toBeNull()

      const expectedData = {
        notes: connection.notes,
        meetingDate: connection.meetingDate,
        meetingPlace: connection.meetingPlace,
      }

      expect(response.data?.saveContact).toMatchObject(expectedData)
    })

    it('throws an error if saving a contact for invalid username', async () => {
      const userA = await createMockUser({
        username: 'user_a',
      })

      const response = await execQuery({
        source: `
        mutation ContactTestQuery($username: String!, $contactInfo: ContactInfoInput) {
          saveContact(username: $username, contactInfo: $contactInfo) {
            id
            meetingDate
            meetingPlace
            notes
          }
        }
        `,
        variableValues: {
          username: 'nonexistent_person',
        },
        contextUser: userA,
      })

      expect(response.errors[0].message).toBe('No user found with the username nonexistent_person')
    })
  })
})
