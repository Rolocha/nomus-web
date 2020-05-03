import { Resolver, Query, Mutation, Ctx, Authorized, Arg, InputType, Field } from 'type-graphql'
import MUUID from 'uuid-mongodb'
import bcrypt from 'bcryptjs'

import { IApolloContext } from 'src/graphql/types'
import { User, Role } from 'src/models/User'

@InputType({ description: 'Input for udpating user profile' })
class ProfileUpdateInput implements Partial<User> {
  @Field({ nullable: true })
  firstName: string
  @Field({ nullable: false })
  middleName?: string
  @Field({ nullable: true })
  lastName: string

  @Field({ nullable: true })
  phoneNumber: string

  @Field({ nullable: true })
  email: string
}

@Resolver()
class UserResolver {
  @Authorized(Role.User, Role.Admin)
  @Query(() => User)
  async user(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ) {
    const requestingUserId = context.user._id
    const requestedUserId = userId ?? requestingUserId

    if (requestedUserId !== requestingUserId && !context.user.roles.includes(Role.Admin)) {
      throw new Error('Insufficient permissions to request a specific user')
    }

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
  @Mutation((type) => User)
  async updateProfile(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Arg('updatedUser', { nullable: false }) userUpdatePayload: ProfileUpdateInput,
    @Ctx() context: IApolloContext
  ) {
    const requestingUserId = context.user._id
    const requestedUserId = userId ?? requestingUserId

    if (requestedUserId !== requestingUserId && !context.user.roles.includes(Role.Admin)) {
      throw new Error('Insufficient permissions to delete a specific user')
    }

    const userBeingUpdated =
      requestedUserId === context.user._id
        ? context.user
        : await User.mongo.findOne({ _id: MUUID.from(requestedUserId) })

    const keysToUpdate = ['name', 'email', 'phoneNumber'] as const
    for (const key of keysToUpdate) {
      // Typescript isn't smart enough to know that the same value type (e.g. name: PersonName) will
      // get transferred from userUpdatePayload to userBeingUpdated
      // @ts-ignore
      userBeingUpdated[key] = userUpdatePayload[key]
    }
    return await userBeingUpdated.save()
  }

  @Authorized(Role.User)
  @Mutation((type) => String)
  async deleteAccount(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<string> {
    const requestingUserId = context.user._id
    const requestedUserId = userId ?? requestingUserId

    if (requestedUserId !== requestingUserId && !context.user.roles.includes(Role.Admin)) {
      throw new Error('Insufficient permissions to delete a specific user')
    }

    await User.mongo.deleteOne({ _id: MUUID.from(requestedUserId) })
    return requestedUserId
  }
}
export default UserResolver
