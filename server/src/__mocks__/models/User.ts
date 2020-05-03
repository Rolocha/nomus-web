import { UserModel, User } from 'src/models/User'

export const createMockUser = async (userOverride: Partial<User> = {}) => {
  const newUserPayload: Partial<User> = {
    name: {
      first: 'John',
      middle: 'Quincy',
      last: 'Adams',
    },
    email: 'jqadams@usa.com',
    password: 'give-me-liberty-or-give-me-death',
    ...userOverride,
  }

  return await UserModel.create(newUserPayload)
}
