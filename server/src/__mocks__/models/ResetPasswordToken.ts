import { PasswordResetToken } from 'src/models/PasswordResetToken'

export const createMockPasswordResetToken = async (userId: string) => {
  return await PasswordResetToken.mongo.createNewTokenForUser(userId)
}
