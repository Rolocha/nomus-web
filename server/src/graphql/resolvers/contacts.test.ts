import { initDB, cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockUser } from 'src/__mocks__/models/User'
import { createMockConnection } from 'src/__mocks__/models/Connection'
import { PersonName } from 'src/models/subschemas'
import { DocumentType } from '@typegoose/typegoose'

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

  describe('connection', () => {
    it.only("gets a user's connections", async () => {
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
            name{
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
          vcfUrl: user_to.vcfUrl ?? null,
        },
      ]

      expect(response.data?.contacts).toMatchObject(expectedData)
    })
  })
})
