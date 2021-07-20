import bcrypt from 'bcryptjs'
import { UserModel } from 'src/models/User'
import { cleanUpDB, dropAllCollections, initDB } from 'src/test-utils/db'
import { execQuery } from 'src/test-utils/graphql'
import { createMockUser } from 'src/__mocks__/models/User'
import { SendgridTemplate, sgMail } from 'src/util/sendgrid'
import { createMockPasswordResetToken } from 'src/__mocks__/models/ResetPasswordToken'
import { createMockConnection } from 'src/__mocks__/models/Connection'
import { Connection, UserPublicProfile } from 'src/models'
import DeletedObject from 'src/models/DeletedObject'
import { createMockUserPublicProfile } from 'src/__mocks__/models/UserPublicProfile'

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

    it('gets the information from UserPublicProfile', async () => {
      const user = await createMockUser()

      const response = await execQuery({
        source: `
          query GetUserTestQuery {
            user {
              publicProfile {
                headline
              }
            }
          }
        `,
        contextUser: user,
      })

      const publicProfile = await UserPublicProfile.mongo.findById(user.publicProfile)
      expect(response.data?.user?.publicProfile?.headline).toBe(publicProfile.headline)
    })
  })

  describe('changePassword', () => {
    it('changes the password for the context user', async () => {
      const currentPassword = 'abc123'
      const newPassword = 'horsebatterystaplecorrect'
      const user = await createMockUser({
        // Will get hashed by the mongoose pre-save hook
        password: currentPassword,
      })
      const response = await execQuery({
        source: `
          mutation ChangePasswordTestQuery($currentPassword: String!, $newPassword: String!) {
            changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
              id
            }
          }
        `,
        variableValues: {
          currentPassword,
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
      const currentPassword = 'abc123'
      const newPassword = 'def456'
      const user = await createMockUser({
        // Will get hashed by the mongoose pre-save hook
        password: currentPassword,
      })
      const response = await execQuery({
        source: `
          mutation ChangePasswordTestQuery($currentPassword: String!, $newPassword: String!) {
            changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
              id
            }
          }
        `,
        variableValues: {
          currentPassword: '', // pass INCORRECT old password
          newPassword,
          confirmNewPassword: newPassword,
        },
        contextUser: user,
      })

      expect(response.data).toBe(null)
      expect(response.errors[0].message).toBe('incorrect-current-password')
    })

    it('errors if the password is too simple', async () => {
      const currentPassword = 'abc123'
      const newPassword = 'def456'
      const user = await createMockUser({
        // Will get hashed by the mongoose pre-save hook
        password: currentPassword,
      })
      const response = await execQuery({
        source: `
          mutation ChangePasswordTestQuery($currentPassword: String!, $newPassword: String!) {
            changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
              id
            }
          }
        `,
        variableValues: {
          currentPassword,
          newPassword,
          confirmNewPassword: newPassword,
        },
        contextUser: user,
      })

      expect(response.data).toBe(null)
      expect(response.errors[0].message).toBe('password-too-weak')
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
        mutation UpdateProfileTestQuery($updatedUser: ProfileUpdateInput!) {
          updateProfile(updatedUser: $updatedUser) {
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

      const updatedUser = await UserModel.findById(response.data.updateProfile.id).populate(
        'publicProfile'
      )
      const userPublicProfile = updatedUser.publicProfile as UserPublicProfile
      expect(updatedUser.name.first).toBe(updatePayload.firstName)
      expect(updatedUser.name.middle).toBe(updatePayload.middleName)
      expect(updatedUser.name.last).toBe(updatePayload.lastName)
      expect(updatedUser.email).toBe(updatePayload.email)

      expect(userPublicProfile.headline).toBe(updatePayload.headline)
      expect(userPublicProfile.phoneNumber).toBe(updatePayload.phoneNumber)
      expect(userPublicProfile.bio).toBe(updatePayload.bio)
    })

    it('can perform a partial update', async () => {
      const publicProfile = await createMockUserPublicProfile({ headline: 'headline' })
      const user = await createMockUser({ publicProfile })
      const updatePayload = {
        bio: 'added some more stuff',
      }
      const response = await execQuery({
        source: `
        mutation UpdateProfileTestQuery($updatedUser: ProfileUpdateInput!) {
          updateProfile(updatedUser: $updatedUser) {
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

      const updatedUser = await UserModel.findById(response.data.updateProfile.id).populate(
        'publicProfile'
      )
      const userPublicProfile = updatedUser.publicProfile as UserPublicProfile

      // Expect the old data
      expect(updatedUser.name.first).toBe(user.name.first)
      expect(updatedUser.name.middle).toBe(user.name.middle)
      expect(updatedUser.name.last).toBe(user.name.last)
      expect(updatedUser.email).toBe(user.email)
      expect(userPublicProfile.headline).toBe(publicProfile.headline)
      expect(userPublicProfile.phoneNumber).toBe(publicProfile.phoneNumber)

      // Expect the updated data
      expect(userPublicProfile.bio).toBe(updatePayload.bio)
    })

    it('de-verifies email and sends a verification email if email was changed', async () => {
      const user = await createMockUser({
        name: {
          first: 'L',
          last: 'A',
        },
        email: 'abc@gmail.com',
        isEmailVerified: true,
      })
      const updatePayload = {
        email: 'newone@gmail.com',
      }
      const response = await execQuery({
        source: `
        mutation UpdateProfileTestQuery($updatedUser: ProfileUpdateInput!) {
          updateProfile(updatedUser: $updatedUser) {
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
      const otherUser = await createMockUser()
      const connection1 = await createMockConnection({ from: user, to: otherUser })
      const connection2 = await createMockConnection({ to: user, from: otherUser })

      await execQuery({
        source: `
          mutation DeleteUserTestQuery {
            deleteUser
          }
        `,
        contextUser: user,
      })

      const findUser = await UserModel.findById(user.id)
      expect(findUser).toBeNull()
      const connections = await Connection.mongo.find()
      expect(connections.length).toBe(0)

      const deletedUser = await DeletedObject.mongo.findById(user.id)
      expect(deletedUser).not.toBeNull()
      const deletedConnection1 = await DeletedObject.mongo.findById(connection1.id)
      expect(deletedConnection1).not.toBeNull()
      const deletedConnection2 = await DeletedObject.mongo.findById(connection2.id)
      expect(deletedConnection2).not.toBeNull()
    })
  })

  describe('updateUsername', () => {
    it('updates the username', async () => {
      const user = await createMockUser({})
      const response = await execQuery({
        source: `
        mutation UpdateUsernameTestQuery($username: String!) {
          updateUsername(username: $username) {
            id
            username
          }
        }
        `,
        variableValues: {
          username: 'new-one',
        },
        contextUser: user,
      })

      // We should assert on the DB user as well as the one on the GraphQL response
      const updatedUser = await UserModel.findById(response.data.updateUsername.id)
      expect(updatedUser.username).toBe('new-one')
      expect(response.data.updateUsername.username).toBe('new-one')
    })
  })

  describe('sendPasswordResetEmail', () => {
    let sgMailSendSpy = null
    beforeEach(() => {
      sgMailSendSpy = jest.spyOn(sgMail, 'send').mockResolvedValue({} as any) // don't really care about response since we don't use it right now
    })

    afterEach(() => {
      sgMailSendSpy.mockClear()
    })
    it('sends the password reset email if a user with the provided email exists', async () => {
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

    it('errors if the password is too weak', async () => {
      const newPassword = 'weak'
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
          userId: user.id,
        },
      })

      expect(response.errors).toContainEqual(
        expect.objectContaining({
          message: 'password-too-weak',
        })
      )
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
          message: 'Invalid password reset link.',
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
          message: 'Invalid password reset link.',
        })
      )
    })
  })
})
