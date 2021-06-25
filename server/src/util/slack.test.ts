import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { postNewOrder } from 'src/util/slack'
import { createMockCardVersion } from 'src/__mocks__/models/CardVersion'
import { createMockOrder } from 'src/__mocks__/models/Order'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('slack API', () => {
  afterEach(async () => {
    await dropAllCollections()
  })

  describe('sends messages', () => {
    it('sends a message to the orders channel', async () => {
      const order = await createMockOrder()
      const res = await postNewOrder('C02598Y499U', order)
      console.log(res)
    })
  })
})
