import { DocumentType } from '@typegoose/typegoose'
import { GraphQLUpload } from 'apollo-server-express'
import bcrypt from 'bcryptjs'
import { FileUpload } from 'graphql-upload'
import { IApolloContext } from 'src/graphql/types'
import { User, validateUsername } from 'src/models/User'
import CardVersion from 'src/models/CardVersion'
import { Role } from 'src/util/enums'
import * as S3 from 'src/util/s3'
import { Arg, Authorized, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import MUUID from 'uuid-mongodb'
import zxcvbn from 'zxcvbn'
import { AdminOnlyArgs } from '../auth'

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
  private async sanitizeUser(user: DocumentType<User>) {
    if (user.profilePicUrl) {
      const profilePicUrl = await user.getProfilePicUrl()
      user.profilePicUrl = profilePicUrl
    }
    return user
  }

  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Query(() => User)
  async user(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ) {
    const requestingUserId = context.user._id
    const requestedUserId = userId ?? requestingUserId
    const user = await User.mongo
      .findOne({ _id: MUUID.from(requestedUserId) })
      .populate('defaultCardVersion')

    const userObject = user.toObject() as DocumentType<User>
    return await this.sanitizeUser(userObject)
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
    return await this.sanitizeUser(context.user)
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
        : await User.mongo.findOne({ _id: MUUID.from(requestedUserId) })

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

    userBeingUpdated.email = userUpdatePayload.email ?? userBeingUpdated.email
    userBeingUpdated.phoneNumber = userUpdatePayload.phoneNumber ?? userBeingUpdated.phoneNumber
    userBeingUpdated.bio = userUpdatePayload.bio ?? userBeingUpdated.bio
    userBeingUpdated.activated = userUpdatePayload.activated ?? userBeingUpdated.activated

    await userBeingUpdated.save()
    return await this.sanitizeUser(userBeingUpdated)
  }

  @Authorized(Role.User)
  @Mutation((type) => String)
  async deleteUser(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<string> {
    const requestingUserId = context.user._id
    const requestedUserId = userId ?? requestingUserId

    await User.mongo.deleteOne({ _id: MUUID.from(requestedUserId) })
    return MUUID.from(requestedUserId).toString()
  }

  @Authorized(Role.User)
  @Mutation((type) => User)
  async updateProfilePicture(
    @Arg('file', (type) => GraphQLUpload) file: FileUpload,
    @Ctx() context: IApolloContext
  ): Promise<User> {
    await context.user.updateProfilePic(file)
    return await this.sanitizeUser(context.user)
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
          _id: MUUID.from(cardVersionId),
        })
        .limit(1)
    )[0]

    if (cardVersionToMakeActive == null) {
      throw new Error('Invalid card version id')
    }

    context.user.defaultCardVersion = MUUID.from(cardVersionId)
    await context.user.save()

    const responseUser = await context.user.populate('defaultCardVersion').execPopulate()
    return responseUser
  }
}
export default UserResolver
