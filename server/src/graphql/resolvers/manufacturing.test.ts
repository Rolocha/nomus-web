import { initDB, cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockUser } from 'src/__mocks__/models/User'
import { Role } from 'src/util/enums'
import { Sheet, Card } from 'src/models'
import AWS from 'aws-sdk'
import * as AWSMock from 'aws-sdk-mock'
import { SHEET_CARD_REGEX } from 'src/util/splicer'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('EncodingResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('createMassSheetEncoding', () => {
    it('creates a mass sheet encoding, 5 sheets for an admin', async () => {
      AWSMock.setSDKInstance(AWS)
      const putObjectMock = jest.fn().mockImplementation((_, cb) => {
        cb()
      })
      AWSMock.mock('S3', 'putObject', putObjectMock)

      const adminUser = await createMockUser({ roles: [Role.User, Role.Admin] })
      const numSheets = 5

      const response = await execQuery({
        source: `
          mutation CreateMassSheetEncodingMutation($numSheets: Float!) {
            createMassSheetEncoding(numSheets: $numSheets) {
              s3Url
            }
          }
        `,
        variableValues: {
          numSheets: numSheets,
        },
        contextUser: adminUser,
      })

      const createdSheets = await Sheet.mongo.find({})
      expect(createdSheets.length).toBe(numSheets)
      expect(createdSheets[0].cards.length).toBe(25)

      const createdCards = await Card.mongo.find({})
      expect(createdCards.length).toBe(125)
      expect(createdCards[0].nfcId).toMatch(SHEET_CARD_REGEX)

      expect(putObjectMock.mock.calls[0][0].Bucket).toBe('nomus-assets')
      expect(putObjectMock.mock.calls[0][0].Key).toBe(response.data?.createMassSheetEncoding?.s3Url)
    })
  })
})
