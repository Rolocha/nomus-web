import axios from 'axios'
import { cleanUpDB, initDB } from 'src/test-utils/db'
import { addUserToMailContactsList, SendgridList } from 'src/util/sendgrid'
import { createMockUser } from 'src/__mocks__/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('addUserToMailContactsList', () => {
  it('sends the right request', async () => {
    const axiosSpy = jest.spyOn(axios, 'post').mockResolvedValue({} as any)
    const user = await createMockUser()
    await addUserToMailContactsList(user)
    const options = {
      // eslint-disable-next-line camelcase
      list_ids: [SendgridList.CurrentUsers],
      // eslint-disable-next-line camelcase
      contacts: [{ email: user.email, first_name: user.name.first, last_name: user.name.last }],
    }
    expect(axiosSpy).lastCalledWith('api.sendgrid.com/v3/marketing/contacts', options, {
      headers: {
        authorization: `Bearer ${process.env.SENDGRID_TOKEN}`,
        'content-type': 'application/json',
      },
    })
  })
})
