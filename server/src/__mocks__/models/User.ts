import { UserModel, User } from 'src/models/User'
import { Role } from 'src/util/enums'
import { createMockUserPublicProfile } from 'src/__mocks__/models/UserPublicProfile'

export const createMockUser = async (userOverride: Partial<User> = {}) => {
  const publicProfileInPayload = await createMockUserPublicProfile(
    userOverride.publicProfile as Object
  )

  const newUserPayload: Partial<User> = {
    name: {
      first: 'John',
      middle: 'Quincy',
      last: 'Adams',
    },
    email: `jqadams-${Math.random()}@usa.com`,
    password: 'give-me-liberty-or-give-me-death',
    publicProfile: publicProfileInPayload.id,
    roles: [Role.User],
    ...userOverride,
  }

  return await UserModel.create(newUserPayload)
}
