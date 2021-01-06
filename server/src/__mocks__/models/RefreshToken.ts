import { RefreshToken } from 'src/models/RefreshToken'

export const createMockToken = async (client: string) => {
  return await RefreshToken.mongo.createNewTokenForUser(client)
}
