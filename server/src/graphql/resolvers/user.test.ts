import bcrypt from 'bcryptjs'
import MUUID from 'uuid-mongodb'

import { initDB, cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockUser } from 'src/__mocks__/models/User'
import { UserModel } from 'src/models/User'

beforeAll(async () => {
  await initDB()
})

afterAll(async () => {
  await cleanUpDB()
})

describe('UserResolver', () => {
  afterEach(async () => {
    await dropAllCollections()
  })
  describe('user', () => {
    const UNAUTHORIZED_MSG = 'Access denied! You need to be authorized to perform this action!'
    it('when the userId is provided and context.user is an admin, gets the requested user', async () => {
      const user = await createMockUser()
      const response = await execQuery({
        source: `
          query GetUserTestQuery($userId: String) {
            user(userId: $userId) {
              id
              email
            }
          }
        `,
        variableValues: {
          userId: user.id,
        },
        asAdmin: true,
      })
      expect(response.data?.user?.id).toBe(user.id)
      expect(response.data?.user?.email).toBe(user.email)
    })

    it('when the userId is provided and context.user is not an admin, errors', async () => {
      const { errors, data } = await execQuery({
        source: `
          query GetUserTestQuery($userId: String) {
            user(userId: $userId) {
              id
              email
            }
          }
        `,
        variableValues: {
          userId: 'shouldntmatter',
        },
      })
      expect(errors[0].message).toBe(UNAUTHORIZED_MSG)
      expect(data).toBeNull()
    })

    it('when the userId is not provided, gets the user from context', async () => {
      const user = await createMockUser()

      const response = await execQuery({
        source: `
          query GetUserTestQuery {
            user {
              id
              email
            }
          }
        `,
        contextUser: user,
      })
      expect(response.data?.user?.id).toBe(user.id)
      expect(response.data?.user?.email).toBe(user.email)
    })
  })

  describe('changePassword', () => {
    it('changes the password for the context user', async () => {
      const oldPassword = 'abc123'
      const newPassword = 'def456'
      const user = await createMockUser({
        // Will get hashed by the mongoose pre-save hook
        password: oldPassword,
      })
      const response = await execQuery({
        source: `
          mutation ChangePasswordTestQuery($oldPassword: String!, $newPassword: String!, $confirmNewPassword: String!) {
            changePassword(oldPassword: $oldPassword, newPassword: $newPassword, confirmNewPassword: $confirmNewPassword) {
              id
            }
          }
        `,
        variableValues: {
          oldPassword,
          newPassword,
          confirmNewPassword: newPassword,
        },
        contextUser: user,
      })

      expect(response.data.changePassword.id).toBe(user.id)
      // Can't just check the responde.data.user bc it doesn't include the password field
      const updatedUser = await UserModel.findById(MUUID.from(response.data.changePassword.id))
      expect(await bcrypt.compare(newPassword, updatedUser.password)).toBe(true)
    })

    it('errors if the old password is incorrect', async () => {
      const oldPassword = 'abc123'
      const newPassword = 'def456'
      const user = await createMockUser({
        // Will get hashed by the mongoose pre-save hook
        password: oldPassword,
      })
      const response = await execQuery({
        source: `
          mutation ChangePasswordTestQuery($oldPassword: String!, $newPassword: String!, $confirmNewPassword: String!) {
            changePassword(oldPassword: $oldPassword, newPassword: $newPassword, confirmNewPassword: $confirmNewPassword) {
              id
            }
          }
        `,
        variableValues: {
          oldPassword: '', // pass INCORRECT old password
          newPassword,
          confirmNewPassword: newPassword,
        },
        contextUser: user,
      })

      expect(response.data).toBe(null)
      expect(response.errors[0].message).toBe('incorrect-old-password')
    })

    it("errors if the new passwords don't match", async () => {
      const oldPassword = 'abc123'
      const newPassword = 'def456'
      const user = await createMockUser({
        // Will get hashed by the mongoose pre-save hook
        password: oldPassword,
      })
      const response = await execQuery({
        source: `
          mutation ChangePasswordTestQuery($oldPassword: String!, $newPassword: String!, $confirmNewPassword: String!) {
            changePassword(oldPassword: $oldPassword, newPassword: $newPassword, confirmNewPassword: $confirmNewPassword) {
              id
            }
          }
        `,
        variableValues: {
          oldPassword,
          newPassword,
          confirmNewPassword: '', // non-matching confirmation
        },
        contextUser: user,
      })

      expect(response.data).toBe(null)
      expect(response.errors[0].message).toBe('password-confirmation-no-match')
    })
  })

  describe('updateProfile', () => {
    it('updates the specified properties on the context user', async () => {
      const user = await createMockUser({
        name: {
          first: 'A',
          last: 'A',
        },
        email: 'abc@gmail.com',
        phoneNumber: '5555555555',
      })
      const updatePayload = {
        firstName: 'B',
        lastName: 'G',
        email: 'newone@gmail.com',
        phoneNumber: '1234567890',
      }
      const response = await execQuery({
        source: `
        mutation UpdateProfileTestQuery($userId: String, $updatedUser: ProfileUpdateInput!) {
          updateProfile(userId: $userId, updatedUser: $updatedUser) {
            id
            name {
              first
              last
            }
            email
            phoneNumber
          }
        }
        `,
        variableValues: {
          updatedUser: updatePayload,
        },
        contextUser: user,
      })

      // We should assert on the DB user as well as the one on the GraphQL response
      const updatedUser = await UserModel.findById(MUUID.from(response.data.updateProfile.id))
      for (const userObject of [updatedUser, response.data.updateProfile]) {
        expect(userObject.name.first).toBe(updatePayload.firstName)
        expect(userObject.name.middle == null).toBe(true)
        expect(userObject.name.last).toBe(updatePayload.lastName)
        expect(userObject.email).toBe(updatePayload.email)
        expect(userObject.phoneNumber).toBe(updatePayload.phoneNumber)
      }
    })
  })

  describe('deleteAccount', () => {
    it("deletes the context user's account", async () => {
      const user = await createMockUser()
      const response = await execQuery({
        source: `
          mutation DeleteUserTestQuery {
            deleteUser
          }
        `,
        contextUser: user,
      })

      expect(response.data.deleteUser).toBe(user.id)
      const deletedUser = await UserModel.findById(MUUID.from(user.id))
      expect(deletedUser).toBeNull()
    })
  })
})
