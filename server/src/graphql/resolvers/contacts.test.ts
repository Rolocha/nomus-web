import { DocumentType } from '@typegoose/typegoose'
import { PersonName } from 'src/models/subschemas'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockConnection } from 'src/__mocks__/models/Connection'
import { createMockUser } from 'src/__mocks__/models/User'
import { Role } from 'src/util/enums'
import { Connection } from 'src/models'

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
      const user_to_1 = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })
      const user_to_2 = await createMockUser({
        name: { first: 'Another', middle: 'Such', last: 'Person' },
        email: 'person2@greendale.com',
        password: 'save-greendale',
      })
      const connection_1 = await createMockConnection({ from: user_from._id, to: user_to_1._id })
      const connection_2 = await createMockConnection({ from: user_from._id, to: user_to_2._id })

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
        contextUser: user_from,
      })

      const expectedData = [
        {
          id: user_to_1.id,
          name: (user_to_1.name as DocumentType<PersonName>).toObject(),
          notes: connection_1.notes ?? null,
          phoneNumber: user_to_1.phoneNumber ?? null,
          email: user_to_1.email,
          cardFrontImageUrl: null,
          cardBackImageUrl: null,
          vcfUrl: user_to_1.vcfUrl ?? null,
        },
        {
          id: user_to_2.id,
          name: (user_to_2.name as DocumentType<PersonName>).toObject(),
          notes: connection_2.notes ?? null,
          phoneNumber: user_to_2.phoneNumber ?? null,
          email: user_to_2.email,
          cardFrontImageUrl: null,
          cardBackImageUrl: null,
          vcfUrl: user_to_2.vcfUrl ?? null,
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
            cardFrontImageUrl
            cardBackImageUrl
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
          cardFrontImageUrl: null,
          cardBackImageUrl: null,
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
      const meetingDate = new Date()
      const connection = await createMockConnection({
        from: user_from._id,
        to: user_to._id,
        meetingDate,
        meetingPlace: 'there',
        notes: 'foo',
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
          contactId: user_to.id,
        },
        contextUser: user_from,
      })

      const expectedData = {
        id: user_to.id,
        name: (user_to.name as DocumentType<PersonName>).toObject(),
        phoneNumber: user_to.phoneNumber ?? null,
        email: user_to.email,
        cardFrontImageUrl: null,
        cardBackImageUrl: null,
        vcfUrl: user_to.vcfUrl ?? null,
        notes: connection.notes ?? null,
        meetingDate: meetingDate.getTime(),
        meetingPlace: connection.meetingPlace,
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
          contactId: user_to.id,
        },
        contextUser: user_from,
      })

      expect(response.errors).toBeDefined()
    })
  })

  describe('updateNotes mutation', () => {
    it("updates the notes of a user's connection", async () => {
      const user_from = await createMockUser()
      const user_to = await createMockUser({
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })
      const meetingDate = new Date()
      await createMockConnection({
        from: user_from._id,
        to: user_to._id,
        meetingDate,
        meetingPlace: 'there',
        notes: 'foo',
      })

      const response = await execQuery({
        source: `
          mutation UpdateContactInfoMutation($contactId: String!, $contactInfoInput: ContactInfoInput!) {
            updateContactInfo(contactId: $contactId, contactInfoInput: $contactInfoInput) {
              meetingDate
              meetingPlace
              notes
            }
          }
        `,
        variableValues: {
          contactId: user_to.id,
          contactInfoInput: {
            meetingPlace: 'here',
            notes: 'lovely',
          },
        },
        contextUser: user_from,
      })

      expect(response.data?.updateNotes?.meetingPlace).toBe('here')
      expect(response.data?.updateNotes?.meetingDate).toBe(meetingDate.getTime())
      expect(response.data?.updateNotes?.notes).toBe('lovely')
    })
  })

  describe('saveContact mutation', () => {
    it('saves a contact and associated notes to a connection', async () => {
      const user_a = await createMockUser({
        username: 'user_a',
      })
      const user_b = await createMockUser({
        username: 'user_b',
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })

      const response = await execQuery({
        source: `
        mutation ContactTestQuery($username: String!, $notesData: NotesDataInput) {
          saveContact(username: $username, notesData: $notesData) {
            id
            meetingDate
            meetingPlace
            notes
          }
        }
        `,
        variableValues: {
          username: user_b.username,
          notesData: {
            meetingDate: '2020-01-01',
            meetingPlace: 'UCLA',
            additionalNotes: 'more notes',
          },
        },
        contextUser: user_a,
      })

      const connection = await Connection.mongo.findOne({
        from: user_a._id,
        to: user_b._id,
      })

      expect(connection).not.toBeNull()

      const expectedData = {
        notes: connection.notes,
        meetingDate: connection.meetingDate.getTime(),
        meetingPlace: connection.meetingPlace,
      }

      expect(response.data?.saveContact).toMatchObject(expectedData)
    })

    it('throws an error if saving a contact that was already saved', async () => {
      const user_a = await createMockUser({
        username: 'user_a',
      })
      const user_b = await createMockUser({
        username: 'user_b',
        name: { first: 'Jeff', middle: 'William', last: 'Winger' },
        email: 'fake_lawyer@greendale.com',
        password: 'save-greendale',
      })

      const execSave = async () => {
        return await execQuery({
          source: `
        mutation ContactTestQuery($username: String!, $notesData: NotesDataInput) {
          saveContact(username: $username, notesData: $notesData) {
            id
            meetingDate
            meetingPlace
            notes
          }
        }
        `,
          variableValues: {
            username: user_b.username,
          },
          contextUser: user_a,
        })
      }

      const response = await execSave()
      expect(response.errors).toBeUndefined()

      // Now try saving again and make sure it fails
      const secondResponse = await execSave()
      expect(secondResponse.errors[0].message).toBe('Contact already saved')
    })

    it('throws an error if saving a contact for invalid username', async () => {
      const user_a = await createMockUser({
        username: 'user_a',
      })

      const response = await execQuery({
        source: `
        mutation ContactTestQuery($username: String!, $notesData: NotesDataInput) {
          saveContact(username: $username, notesData: $notesData) {
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
        contextUser: user_a,
      })

      expect(response.errors[0].message).toBe('No user found with the username nonexistent_person')
    })
  })
})
