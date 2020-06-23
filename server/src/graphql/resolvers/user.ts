import bcrypt from 'bcryptjs'
import { IApolloContext } from 'src/graphql/types'
import { User } from 'src/models/User'
import { Arg, Authorized, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import MUUID from 'uuid-mongodb'
import { AdminOnlyArgs } from '../auth'
import { Role } from 'src/util/enums'

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
}

@Resolver()
class UserResolver {
  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Query(() => User)
  async user(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ) {
    const requestingUserId = context.user._id
    const requestedUserId = userId ?? requestingUserId
    return await User.mongo.findOne({ _id: MUUID.from(requestedUserId) })
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

    // Don't need to hash, a Mongoose pre-save hook will take care of that
    context.user.password = newPassword
    return await context.user.save()
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

    userBeingUpdated.name.first = userUpdatePayload.firstName ?? userBeingUpdated.name.first
    userBeingUpdated.name.middle = userUpdatePayload.middleName ?? userBeingUpdated.name.middle
    userBeingUpdated.name.last = userUpdatePayload.lastName ?? userBeingUpdated.name.last
    userBeingUpdated.headline = userUpdatePayload.headline ?? userBeingUpdated.headline

    userBeingUpdated.email = userUpdatePayload.email ?? userBeingUpdated.email
    userBeingUpdated.phoneNumber = userUpdatePayload.phoneNumber ?? userBeingUpdated.phoneNumber
    userBeingUpdated.bio = userUpdatePayload.bio ?? userBeingUpdated.bio

    return await userBeingUpdated.save()
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
}
export default UserResolver
