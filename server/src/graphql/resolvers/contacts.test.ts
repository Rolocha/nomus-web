import { initDB, cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockUser } from 'src/__mocks__/models/User'
import { createMockConnection } from 'src/__mocks__/models/Connection'
import { PersonName } from 'src/models/subschemas'
import { DocumentType } from '@typegoose/typegoose'
import { Role } from 'src/models/User'

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
    it("get's user's connections", async () => {
      const user_from = await createMockUser()
      const user_to = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })
      const connection = await createMockConnection({ from: user_from._id, to: user_to._id })

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
            cardImageUrl
            vcfUrl
          }
        }
        `,
        contextUser: user_from,
      })

      const expectedData = [
        {
          id: user_to.id,
          name: (user_to.name as DocumentType<PersonName>).toObject(),
          notes: connection.notes ?? null,
          phoneNumber: user_to.phoneNumber ?? null,
          email: user_to.email,
          cardImageUrl: null,
          vcfUrl: user_to.vcfUrl ?? null,
        },
      ]

      expect(response.data?.contacts).toMatchObject(expectedData)
    })

    it('returns an empty list if no connections exists', async () => {
      const user_from = await createMockUser()

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
            cardImageUrl
            vcfUrl
          }
        }
        `,
        contextUser: user_from,
      })

      expect(response.data?.contacts?.length).toBe(0)
    })

    it("doesn't let non-admins query a specific userId", async () => {
      const user_from = await createMockUser()
      const user_to = await createMockUser({
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
            notes
            cardImageUrl
            vcfUrl
          }
        }
        `,
        variableValues: {
          userId: user_to.id,
        },
        contextUser: user_from,
      })
      expect(response.errors[0].message).toContain('denied!')
    })

    it("lets admins query other user's connections", async () => {
      const user_admin = await createMockUser({ roles: [Role.User, Role.Admin] })
      const user_from = await createMockUser({
        name: { first: 'Annie', middle: 'Allison', last: 'Edison' },
        email: 'goody2shoes@greendale.com',
        password: 'save-greendale',
      })
      const user_to = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })
      const connection = await createMockConnection({ from: user_from._id, to: user_to._id })

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
            notes
            cardImageUrl
            vcfUrl
          }
        }
        `,
        variableValues: {
          userId: user_from.id,
        },
        contextUser: user_admin,
      })

      const expectedData = [
        {
          id: user_to.id,
          name: (user_to.name as DocumentType<PersonName>).toObject(),
          notes: connection.notes ?? null,
          phoneNumber: user_to.phoneNumber ?? null,
          email: user_to.email,
          cardImageUrl: null,
          vcfUrl: user_to.vcfUrl ?? null,
        },
      ]

      expect(response.data?.contacts).toMatchObject(expectedData)
    })
  })
  describe('contact query', () => {
    it('gets a user contact where connection exists', async () => {
      const user_from = await createMockUser()
      const user_to = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })
      const connection = await createMockConnection({ from: user_from._id, to: user_to._id })

      const response = await execQuery({
        source: `
        query ContactTestQuery($contactId: String!) {
          contact(contactId: $contactId) {
            id
            name {
              first
              middle
              last
            }
            phoneNumber
            email
            notes
            cardImageUrl
            vcfUrl
          }
        }
        `,
        variableValues: {
          contactId: user_to.id,
        },
        contextUser: user_from,
      })

      const expectedData = {
        id: user_to.id,
        name: (user_to.name as DocumentType<PersonName>).toObject(),
        notes: connection.notes ?? null,
        phoneNumber: user_to.phoneNumber ?? null,
        email: user_to.email,
        cardImageUrl: null,
        vcfUrl: user_to.vcfUrl ?? null,
      }

      expect(response.data?.contact).toMatchObject(expectedData)
    })
    it('fails if no connection exists', async () => {
      const user_from = await createMockUser()
      const user_to = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })

      const response = await execQuery({
        source: `
        query ContactTestQuery($contactId: String!) {
          contact(contactId: $contactId) {
            id
            name {
              first
              middle
              last
            }
            phoneNumber
            email
            notes
            cardImageUrl
            vcfUrl
          }
        }
        `,
        variableValues: {
          contactId: user_to.id,
        },
        contextUser: user_from,
      })

      expect(response.errors).toBeDefined()
    })
  })
})
