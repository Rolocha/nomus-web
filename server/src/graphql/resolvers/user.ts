import { Resolver, Query, Mutation, Ctx, Authorized, Arg, InputType, Field } from 'type-graphql'
import MUUID from 'uuid-mongodb'
import bcrypt from 'bcryptjs'

import { AdminOnlyArgs } from '../auth'
import { IApolloContext } from 'src/graphql/types'
import { User, Role } from 'src/models/User'

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

    userBeingUpdated.name.first = userUpdatePayload.firstName
    userBeingUpdated.name.middle = userUpdatePayload.middleName
    userBeingUpdated.name.last = userUpdatePayload.lastName

    userBeingUpdated.email = userUpdatePayload.email
    userBeingUpdated.phoneNumber = userUpdatePayload.phoneNumber

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
