import { initDB, cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockSheet } from 'src/__mocks__/models/Sheet'
import { createMockUser } from 'src/__mocks__/models/User'
import { Role } from 'src/util/enums'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('SheetResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('sheet', () => {
    it('gets a sheet based off an id if the user is an Admin', async () => {
      const user = await createMockUser({ roles: [Role.User, Role.Admin] })
      const sheet = await createMockSheet()

      const response = await execQuery({
        source: `
          query SheetTestQuery($sheetId: String!) {
            sheet(sheetId: $sheetId) {
              id
            }
          }
        `,
        variableValues: {
          sheetId: sheet.id,
        },
        contextUser: user,
      })

      expect(response.data?.sheet?.id).toBe(sheet.id)
    })
    it('refuses to get a sheet if user is not Admin', async () => {
      const user = await createMockUser()
      const sheet = await createMockSheet()

      const response = await execQuery({
        source: `
        query SheetTestQuery($sheetId: String!) {
          sheet(sheetId: $sheetId) {
            id
          }
        }
      `,
        variableValues: {
          sheetId: sheet.id,
        },
        contextUser: user,
      })

      expect(response.errors[0].message).toBe(
        "Access denied! You don't have permission for this action!"
      )
    })
  })
})
