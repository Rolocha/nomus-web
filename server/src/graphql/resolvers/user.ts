import { DocumentType } from '@typegoose/typegoose'
import { GraphQLUpload } from 'apollo-server-express'
import bcrypt from 'bcryptjs'
import { FileUpload } from 'graphql-upload'
import { IApolloContext } from 'src/graphql/types'
import { User, validateUsername } from 'src/models/User'
import CardVersion from 'src/models/CardVersion'
import { Role } from 'src/util/enums'
import { Void } from 'src/models/scalars'
import { Arg, Authorized, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'

import zxcvbn from 'zxcvbn'
import { AdminOnlyArgs } from '../auth'
import { isValidUserCheckpointKey } from 'src/models/subschemas'
import PasswordResetToken from 'src/models/PasswordResetToken'
import { BASE_URL } from 'src/config'
import { SendgridTemplate, sgMail } from 'src/util/sendgrid'

@InputType({ description: 'Input for udpating user profile' })
class ProfileUpdateInput implements Partial<User> {
  @Field({ nullable: true })
  username?: string

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
    @Arg('oldPassword', { nullable: false }) oldPassword: string,
    @Arg('newPassword', { nullable: false }) newPassword: string,
    @Arg('confirmNewPassword', { nullable: false }) confirmNewPassword: string,
    @Ctx() context: IApolloContext
  ) {
    const oldPasswordMatches = await bcrypt.compare(oldPassword, context.user.password)
    if (!oldPasswordMatches) {
      throw new Error('incorrect-old-password')
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error('password-confirmation-no-match')
    }

    if (zxcvbn(newPassword).score < 2) {
      throw new Error('password-too-weak')
    }

    // Don't need to hash, a Mongoose pre-save hook will take care of that
    context.user.password = newPassword
    await context.user.save()
    return await this.userFromMongoDocument(context.user)
  }

  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Mutation((type) => User)
  async updateProfile(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Arg('updatedUser', { nullable: false }) userUpdatePayload: ProfileUpdateInput,
    @Ctx() context: IApolloContext
  ) {
    const requestingUserId = context.user._id
    const requestedUserId = userId ?? requestingUserId

    const userBeingUpdated =
      requestedUserId === context.user._id
        ? context.user
        : await User.mongo.findOne({ _id: requestedUserId })

    if (userUpdatePayload.username) {
      if (await validateUsername(userUpdatePayload.username)) {
        userBeingUpdated.username = userUpdatePayload.username ?? userBeingUpdated.username
      } else {
        throw new Error('non-unique-username')
      }
    }

    userBeingUpdated.name.first = userUpdatePayload.firstName ?? userBeingUpdated.name.first
    userBeingUpdated.name.middle = userUpdatePayload.middleName ?? userBeingUpdated.name.middle
    userBeingUpdated.name.last = userUpdatePayload.lastName ?? userBeingUpdated.name.last
    userBeingUpdated.headline = userUpdatePayload.headline ?? userBeingUpdated.headline

    // If user is changing their email, mark it as no longer verified and send a new verification email
    if (userBeingUpdated.email !== userUpdatePayload.email) {
      userBeingUpdated.email = userUpdatePayload.email
      userBeingUpdated.isEmailVerified = false
      userBeingUpdated.sendVerificationEmail() // No need to await
    }

    userBeingUpdated.phoneNumber = userUpdatePayload.phoneNumber ?? userBeingUpdated.phoneNumber
    userBeingUpdated.bio = userUpdatePayload.bio ?? userBeingUpdated.bio
    userBeingUpdated.activated = userUpdatePayload.activated ?? userBeingUpdated.activated

    await userBeingUpdated.save()
    return await this.userFromMongoDocument(userBeingUpdated)
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
    user.password = newPassword
    await user.save()

    return null
  }
}
export default UserResolver
