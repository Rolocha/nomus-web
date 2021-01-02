import { Token, TokenModel } from 'src/models/Token'

export const createMockToken = async (client: string, override: Partial<Token> = {}) => {
  return await TokenModel.createNewTokenForUser(client)
}
