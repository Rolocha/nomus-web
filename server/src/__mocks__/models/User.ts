import { UserModel, User } from 'src/models/User'
import { Role } from 'src/util/enums'

export const createMockUser = async (userOverride: Partial<User> = {}) => {
  const newUserPayload: Partial<User> = {
    name: {
      first: 'John',
      middle: 'Quincy',
      last: 'Adams',
    },
    email: `jqadams-${Math.random()}@usa.com`,
    password: 'give-me-liberty-or-give-me-death',
    roles: [Role.User],
    ...userOverride,
  }

  return await UserModel.create(newUserPayload)
}
