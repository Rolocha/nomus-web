import { DocumentType } from '@typegoose/typegoose'
import { ApolloError, GraphQLUpload, UserInputError } from 'apollo-server-express'
import bcrypt from 'bcryptjs'
import { FileUpload } from 'graphql-upload'
import { IApolloContext } from 'src/graphql/types'
import { User } from 'src/models/User'
import CardVersion from 'src/models/CardVersion'
import { Role } from 'src/util/enums'
import { Void } from 'src/models/scalars'
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UnauthorizedError,
} from 'type-graphql'

import zxcvbn from 'zxcvbn'
import { AdminOnlyArgs } from '../auth'
import { isValidUserCheckpointKey } from 'src/models/subschemas'
import PasswordResetToken from 'src/models/PasswordResetToken'
import { BASE_URL, MINIMUM_PASSWORD_STRENGTH } from 'src/config'
import { SendgridTemplate, sgMail } from 'src/util/sendgrid'

@InputType({ description: 'Input for udpating user profile' })
class ProfileUpdateInput implements Partial<User> {
  @Field({ nullable: true })
  firstName?: string
  @Field({ nullable: true })
  middleName?: string
  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  headline?: string

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  activated?: boolean
}

@Resolver()
class UserResolver {
  // Performs any necessary changes to go from DB representation of User to public representation of User
  private async userFromMongoDocument(user: DocumentType<User>): Promise<User> {
    await user.populate('defaultCardVersion').execPopulate()
    return {
      ...user.toObject(),
      profilePicUrl: await user.getProfilePicUrl(),
    }
  }

  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Query(() => User)
  async user(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<User> {
    const requestingUserId = context.user._id
    const requestedUserId = userId ?? requestingUserId
    const user = await User.mongo.findOne({ _id: requestedUserId }).populate('defaultCardVersion')

    const userObject = user as DocumentType<User>
    return await this.userFromMongoDocument(userObject)
  }

  @Authorized(Role.User)
  @Mutation((type) => User)
  async changePassword(
    @Arg('currentPassword', { nullable: false }) currentPassword: string,
    @Arg('newPassword', { nullable: false }) newPassword: string,
    @Ctx() context: IApolloContext
  ) {
    const currentPasswordMatches = await bcrypt.compare(currentPassword, context.user.password)
    if (!currentPasswordMatches) {
      throw new Error('incorrect-current-password')
    }

    if (zxcvbn(newPassword).score < MINIMUM_PASSWORD_STRENGTH) {
      throw new Error('password-too-weak')
    }

    // Don't need to hash, a Mongoose pre-save hook will take care of that
    context.user.password = newPassword
    await context.user.save()
    return await this.userFromMongoDocument(context.user)
  }

  @Authorized(Role.User)
  @Mutation((type) => User)
  async updateUsername(
    @Arg('username', { nullable: true }) username: string,
    @Ctx() context: IApolloContext
  ): Promise<User> {
    if (!context.user) {
      throw new UnauthorizedError()
    }

    const usernameUpdateResult = await context.user.updateUsername(username)
    if (!usernameUpdateResult.isSuccess) {
      switch (usernameUpdateResult.error.name) {
        case 'empty-username':
        case 'username-too-short':
          throw new UserInputError('Invalid request', {
            username: 'That username is not allowed.',
          })

        case 'reserved-route':
        case 'non-unique-username':
          throw new UserInputError('Invalid request', {
            username: 'That username is already taken.',
          })
        case 'unknown-error':
          throw new ApolloError('Unknown error')
      }
    }

    return context.user
  }

  @Authorized(Role.User)
  @Mutation((type) => User)
  async updateProfile(
    @Arg('updatedUser', { nullable: false }) userUpdatePayload: ProfileUpdateInput,
    @Ctx() context: IApolloContext
  ) {
    if (!context.user) {
      throw new UnauthorizedError()
    }

    context.user.name.first = userUpdatePayload.firstName ?? context.user.name.first
    context.user.name.middle = userUpdatePayload.middleName ?? context.user.name.middle
    context.user.name.last = userUpdatePayload.lastName ?? context.user.name.last
    context.user.headline = userUpdatePayload.headline ?? context.user.headline
    context.user.phoneNumber = userUpdatePayload.phoneNumber ?? context.user.phoneNumber
    context.user.bio = userUpdatePayload.bio ?? context.user.bio
    context.user.activated = userUpdatePayload.activated ?? context.user.activated

    await context.user.save()
    return await this.userFromMongoDocument(context.user)
  }

  @Authorized(Role.User)
  @Mutation((type) => String)
  async deleteUser(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<string> {
    const requestingUserId = context.user._id
    const requestedUserId = userId ?? requestingUserId

    await User.mongo.deleteOne({ _id: requestedUserId })
    return requestedUserId.toString()
  }

  @Authorized(Role.User)
  @Mutation((type) => User)
  async updateProfilePicture(
    @Arg('file', (type) => GraphQLUpload) file: FileUpload,
    @Ctx() context: IApolloContext
  ): Promise<User> {
    await context.user.updateProfilePic(file)
    return await this.userFromMongoDocument(context.user)
  }

  @Authorized(Role.User)
  @Mutation(() => User)
  async changeActiveCardVersion(
    @Arg('cardVersionId', { nullable: false }) cardVersionId: string,
    @Ctx() context: IApolloContext
  ): Promise<User> {
    const cardVersionToMakeActive = (
      await CardVersion.mongo
        .find({
          user: context.user._id,
          _id: cardVersionId,
        })
        .limit(1)
    )[0]

    if (cardVersionToMakeActive == null) {
      throw new Error('Invalid card version id')
    }

    context.user.defaultCardVersion = cardVersionId
    await context.user.save()

    return await this.userFromMongoDocument(context.user)
  }

  @Authorized(Role.User)
  @Mutation(() => User)
  async updateUserCheckpoints(
    @Arg('checkpointsReached', (type) => [String], { nullable: false })
    checkpointsReached: Array<string>,
    @Ctx() context: IApolloContext
  ): Promise<User> {
    for (const checkpointName of checkpointsReached) {
      if (isValidUserCheckpointKey(checkpointName)) {
        context.user.checkpoints[checkpointName] = true
      }
    }
    await context.user.save()
    return await this.userFromMongoDocument(context.user)
  }

  @Mutation(() => Void, { nullable: true })
  async sendPasswordResetEmail(@Arg('email', { nullable: false }) email: string): Promise<void> {
    const user = await User.mongo.findOne({ email })
    if (user == null) {
      return null
    }

    // Invalidate existing password reset tokens before creating a new one so there's only ever one functioning reset link per user
    await PasswordResetToken.mongo.invalidateAllForUser(user.id)
    const { preHashToken } = await PasswordResetToken.mongo.createNewTokenForUser(user.id)

    const passwordResetURLQueryParams = new URLSearchParams()
    passwordResetURLQueryParams.set('token', preHashToken)
    passwordResetURLQueryParams.set('userId', user.id)
    const passwordResetLink = `${BASE_URL}/reset-password?${passwordResetURLQueryParams.toString()}`

    await sgMail.send({
      to: user.email,
      from: 'hi@nomus.me',
      templateId: SendgridTemplate.ResetPassword,
      dynamicTemplateData: {
        passwordResetLink,
        firstName: user.name.first,
      },
    })

    return null
  }

  @Mutation(() => Void, { nullable: true })
  async resetPassword(
    @Arg('token', { nullable: false }) token: string,
    @Arg('newPassword', { nullable: false }) newPassword: string,
    @Arg('userId', { nullable: false }) userId: string
  ): Promise<void> {
    const user = await User.mongo.findById(userId)
    if (user == null) {
      throw new Error('invalid-user')
    }

    // Verify token belongs to the user and is valid
    const isTokenValid = await PasswordResetToken.mongo.verify(token, userId)
    if (!isTokenValid) {
      throw new Error('invalid-token')
    }

    // Update the user's password, let User's pre-save hook handle hashing it
    if (zxcvbn(newPassword).score < MINIMUM_PASSWORD_STRENGTH) {
      throw new Error('password-too-weak')
    }

    user.password = newPassword
    await user.save()

    return null
  }
}
export default UserResolver
