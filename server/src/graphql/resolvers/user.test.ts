import bcrypt from 'bcryptjs'
import { UserModel, validateUsername } from 'src/models/User'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockUser } from 'src/__mocks__/models/User'
import { SendgridTemplate, sgMail } from 'src/util/sendgrid'
import { Result } from 'src/util/error'
import { createMockPasswordResetToken } from 'src/__mocks__/models/ResetPasswordToken'

jest.mock('src/util/sendgrid')

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
      const newPassword = 'horsebatterystaplecorrect'
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
      const updatedUser = await UserModel.findById(response.data.changePassword.id)
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

    it('errors if the password is too simple', async () => {
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

      expect(response.data).toBe(null)
      expect(response.errors[0].message).toBe('password-too-weak')
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
          first: 'L',
          last: 'A',
        },
        email: 'abc@gmail.com',
        phoneNumber: '5555555555',
      })
      const updatePayload = {
        firstName: 'B',
        middleName: 'M',
        lastName: 'G',
        headline: 'CEO at TestWriting, Inc.',
        email: 'newone@gmail.com',
        phoneNumber: '1234567890',
        bio: 'this is my new bio',
      }
      const response = await execQuery({
        source: `
        mutation UpdateProfileTestQuery($userId: String, $updatedUser: ProfileUpdateInput!) {
          updateProfile(userId: $userId, updatedUser: $updatedUser) {
            id
            name {
              first
              middle
              last
            }
            headline
            email
            phoneNumber
            bio
          }
        }
        `,
        variableValues: {
          updatedUser: updatePayload,
        },
        contextUser: user,
      })

      // We should assert on the DB user as well as the one on the GraphQL response
      const updatedUser = await UserModel.findById(response.data.updateProfile.id)
      for (const userObject of [updatedUser, response.data.updateProfile]) {
        expect(userObject.name.first).toBe(updatePayload.firstName)
        expect(userObject.name.middle).toBe(updatePayload.middleName)
        expect(userObject.name.last).toBe(updatePayload.lastName)
        expect(userObject.headline).toBe(updatePayload.headline)

        expect(userObject.email).toBe(updatePayload.email)
        expect(userObject.phoneNumber).toBe(updatePayload.phoneNumber)
        expect(userObject.bio).toBe(updatePayload.bio)
      }
    })

    it('de-verifies email and sends a verification email if email was changed', async () => {
      const user = await createMockUser({
        name: {
          first: 'L',
          last: 'A',
        },
        email: 'abc@gmail.com',
        phoneNumber: '5555555555',
        isEmailVerified: true,
      })
      const updatePayload = {
        email: 'newone@gmail.com',
      }
      const response = await execQuery({
        source: `
        mutation UpdateProfileTestQuery($userId: String, $updatedUser: ProfileUpdateInput!) {
          updateProfile(userId: $userId, updatedUser: $updatedUser) {
            id
            email
            isEmailVerified
          }
        }
        `,
        variableValues: {
          updatedUser: updatePayload,
        },
        contextUser: user,
      })

      // We should assert on the DB user as well as the one on the GraphQL response
      const updatedUser = await UserModel.findById(response.data.updateProfile.id)
      for (const userObject of [updatedUser, response.data.updateProfile]) {
        expect(userObject.email).toBe(updatePayload.email)
        expect(userObject.isEmailVerified).toBe(false)
      }

      expect(sgMail.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: updatedUser.email,
        })
      )
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
      const deletedUser = await UserModel.findById(user.id)
      expect(deletedUser).toBeNull()
    })
  })

  describe('username testing', () => {
    it('has a username collision', async () => {
      await createMockUser({ username: 'roxmysox' })
      expect(await validateUsername('roxmysox')).toStrictEqual(Result.fail('non-unique-username'))
    })

    it('does not have a collision', async () => {
      await createMockUser({ username: 'roxmysox' })
      expect(await validateUsername('roxyoursox')).toStrictEqual(Result.ok())
    })

    it('creates a new username for a new user', async () => {
      const user = await createMockUser({
        name: {
          first: 'A',
          last: 'A',
        },
      })
      expect(user.username.substring(0, 4)).toBe('a-a-')
      expect(user.username.length).toBe(10)
    })
  })
  describe('reserved routes', () => {
    it('tries to be a reserved route', async () => {
      expect(await validateUsername('dashboard')).toStrictEqual(Result.fail('reserved-route'))
    })
  })

  describe('sendPasswordResetEmail', () => {
    it('sends the password reset email if a user with the provided email exists', async () => {
      jest.spyOn(sgMail, 'send').mockResolvedValue({} as any) // don't really care about response since we don't use it right now
      const user = await createMockUser({
        email: 'blah@nomus.me',
        password: 'abc123',
      })
      await execQuery({
        source: `
          mutation SendPasswordResetEmailQuery($email: String!) {
            sendPasswordResetEmail(email: $email)
          }
        `,
        variableValues: {
          email: user.email,
        },
      })

      expect(sgMail.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          templateId: SendgridTemplate.ResetPassword,
          dynamicTemplateData: {
            passwordResetLink: expect.stringMatching(/reset-password\?/),
            firstName: user.name.first,
          },
        })
      )
    })

    // Quiet success is key to not leaking data about which emails are valid ones in our DB
    it("quietly succeeds without sending an email if the email doesn't belong to any use", async () => {
      jest.spyOn(sgMail, 'send').mockResolvedValue({} as any) // don't really care about response since we don't use it right now
      const response = await execQuery({
        source: `
          mutation SendPasswordResetEmailQuery($email: String!) {
            sendPasswordResetEmail(email: $email)
          }
        `,
        variableValues: {
          email: 'foo@nomus.me',
        },
      })

      expect(response.errors).toBe(undefined)
      expect(response.data.sendPasswordResetEmail).toBe(null)
      expect(sgMail.send).not.toHaveBeenCalled()
    })
  })

  describe('resetPassword', () => {
    it('resets the password based on the provided token, newPassword, userId', async () => {
      const newPassword = 'horsebatterystaplecorrect'
      const user = await createMockUser({
        password: 'abc123',
      })
      const { preHashToken } = await createMockPasswordResetToken(user.id)
      await execQuery({
        source: `
          mutation ResetPasswordTestQuery($token: String!, $newPassword: String!, $userId: String!) {
            resetPassword(token: $token, newPassword: $newPassword, userId: $userId)
          }
        `,
        variableValues: {
          token: preHashToken,
          newPassword,
          userId: user.id,
        },
      })

      // Can't just check the responde.data.user bc it doesn't include the password field
      const updatedUser = await UserModel.findById(user.id)
      expect(await bcrypt.compare(newPassword, updatedUser.password)).toBe(true)
    })

    it('errors if the token is present but invalid', async () => {
      const newPassword = 'horsebatterystaplecorrect'
      const user = await createMockUser({
        password: 'abc123',
      })

      // Intentionally ignoring the result
      await createMockPasswordResetToken(user.id)
      const response = await execQuery({
        source: `
          mutation ResetPasswordTestQuery($token: String!, $newPassword: String!, $userId: String!) {
            resetPassword(token: $token, newPassword: $newPassword, userId: $userId)
          }
        `,
        variableValues: {
          token: "uh oh, what's this?",
          newPassword,
          userId: user.id,
        },
      })

      // Can't just check the responde.data.user bc it doesn't include the password field
      expect(response.errors).toContainEqual(
        expect.objectContaining({
          message: 'invalid-token',
        })
      )
    })

    it('errors if the userId is invalid', async () => {
      const newPassword = 'horsebatterystaplecorrect'
      const user = await createMockUser({
        password: 'abc123',
      })
      const { preHashToken } = await createMockPasswordResetToken(user.id)
      const response = await execQuery({
        source: `
          mutation ResetPasswordTestQuery($token: String!, $newPassword: String!, $userId: String!) {
            resetPassword(token: $token, newPassword: $newPassword, userId: $userId)
          }
        `,
        variableValues: {
          token: preHashToken,
          newPassword,
          userId: 'not a real user id',
        },
      })

      // Can't just check the responde.data.user bc it doesn't include the password field
      expect(response.errors).toContainEqual(
        expect.objectContaining({
          message: 'invalid-user',
        })
      )
    })
  })
})
