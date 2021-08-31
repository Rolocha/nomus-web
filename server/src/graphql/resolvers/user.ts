import { DocumentType } from '@typegoose/typegoose'
import {
  ApolloError,
  AuthenticationError,
  GraphQLUpload,
  UserInputError,
} from 'apollo-server-express'
import bcrypt from 'bcryptjs'
import { FileUpload } from 'graphql-upload'
import { MINIMUM_PASSWORD_STRENGTH } from 'src/config'
import { NomusProAccessInfo } from 'src/graphql/resolvers/subtypes'
import { IApolloContext } from 'src/graphql/types'
import { Connection, NomusProSubscription } from 'src/models'
import CardVersion from 'src/models/CardVersion'
import PasswordResetToken from 'src/models/PasswordResetToken'
import { Void } from 'src/models/scalars'
import { isValidUserCheckpointKey } from 'src/models/subschemas'
import { User } from 'src/models/User'
import { performTransaction } from 'src/util/db'
import { Role } from 'src/util/enums'
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root,
  UnauthorizedError,
} from 'type-graphql'
import zxcvbn from 'zxcvbn'
import { AdminOnlyArgs } from '../auth'

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
  position?: string

  @Field({ nullable: true })
  company?: string

  @Field({ nullable: true })
  activated?: boolean

  @Field({ nullable: true })
  website?: string
}
@Resolver((of) => User)
class UserResolver {
  // Performs any necessary changes to go from DB representation of User to public representation of User
  private async userFromMongoDocument(user: DocumentType<User>): Promise<User> {
    await user.populate('defaultCardVersion').execPopulate()
    return {
      ...user.toObject(),
      profilePicUrl: await user.getProfilePicUrl(),
    }
  }

  @FieldResolver((of) => NomusProAccessInfo, { nullable: true })
  async nomusProAccessInfo(@Root() user: User): Promise<NomusProAccessInfo | null> {
    return NomusProSubscription.mongo.getAccessInfoForUser(user.id)
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
          throw new UserInputError('Invalid request', {
            username: 'Please enter a non-empty username.',
          })
        case 'reserved-route':
          throw new UserInputError('Invalid request', {
            username: 'That username is not allowed.',
          })
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

    if (userUpdatePayload.email && userUpdatePayload.email !== context.user.email) {
      if (await User.mongo.exists({ email: userUpdatePayload.email })) {
        throw new UserInputError('duplicate-email', {
          email: 'Please enter a different email',
        })
      }
      context.user.email = userUpdatePayload.email
      context.user.isEmailVerified = false
      await context.user.sendVerificationEmail()
    }
    context.user.name.first = userUpdatePayload.firstName ?? context.user.name.first
    context.user.name.middle = userUpdatePayload.middleName ?? context.user.name.middle
    context.user.name.last = userUpdatePayload.lastName ?? context.user.name.last
    context.user.headline = userUpdatePayload.headline ?? context.user.headline
    context.user.phoneNumber = userUpdatePayload.phoneNumber ?? context.user.phoneNumber
    context.user.bio = userUpdatePayload.bio ?? context.user.bio
    context.user.position = userUpdatePayload.position ?? context.user.position
    context.user.company = userUpdatePayload.company ?? context.user.company
    context.user.activated = userUpdatePayload.activated ?? context.user.activated
    context.user.website = userUpdatePayload.website ?? context.user.website

    await context.user.save()
    return await this.userFromMongoDocument(context.user)
  }

  @Authorized(Role.User)
  @Mutation((type) => Void, { nullable: true })
  async deleteUser(@Ctx() context: IApolloContext): Promise<void> {
    const connections = await Connection.mongo.find({
      $or: [{ from: context.user.id }, { to: context.user.id }],
    })

    return performTransaction(async () => {
      const connectionBatchDeletionResult = await Connection.batchDelete(
        connections.map((connection) => connection.id)
      )
      const userDeletionResult = await User.delete(context.user.id)

      if (userDeletionResult.isSuccess && connectionBatchDeletionResult.isSuccess === false) {
        throw new Error('Failed to delete user')
      }
    })
  }

  @Authorized(Role.User)
  @Mutation((type) => User)
  async updateProfilePicture(
    @Arg('file', (type) => GraphQLUpload) file: Promise<FileUpload>,
    @Ctx() context: IApolloContext
  ): Promise<User> {
    const awaitedFile = await file
    await context.user.updateProfilePic(awaitedFile)
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
    const user = (await User.mongo.findOne({ email })) as User
    return user.sendPasswordResetEmail()
  }

  @Query(() => Boolean, {
    nullable: true,
    description: 'Validates whether the reset password token is valid and non-expired',
  })
  async validateResetPasswordLink(
    @Arg('token', { nullable: false }) token: string,
    @Arg('userId', { nullable: false }) userId: string
  ): Promise<boolean> {
    const user = await User.mongo.findById(userId)
    if (user == null) {
      throw new UserInputError('Invalid password reset link.')
    }

    // Verify token belongs to the user and is valid
    const tokenValidity = await PasswordResetToken.mongo.verify(token, userId)
    switch (tokenValidity) {
      case 'invalid':
        throw new UserInputError('Invalid password reset link.')
      case 'expired':
        throw new AuthenticationError('Password reset link expired.')
    }
    return true
  }

  @Mutation(() => Void, { nullable: true })
  async resetPassword(
    @Arg('token', { nullable: false }) token: string,
    @Arg('newPassword', { nullable: false }) newPassword: string,
    @Arg('userId', { nullable: false }) userId: string
  ): Promise<void> {
    const user = await User.mongo.findById(userId)
    if (user == null) {
      throw new UserInputError('Invalid password reset link.')
    }

    // Verify token belongs to the user and is valid
    const tokenValidity = await PasswordResetToken.mongo.verify(token, userId)
    switch (tokenValidity) {
      case 'invalid':
        throw new UserInputError('Invalid password reset link.')
      case 'expired':
        throw new AuthenticationError('Password reset link expired.')
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
