import { RefreshToken } from 'src/models/RefreshToken'

export const createMockRefreshToken = async (client: string) => {
  return await RefreshToken.mongo.createNewTokenForUser(client)
}
