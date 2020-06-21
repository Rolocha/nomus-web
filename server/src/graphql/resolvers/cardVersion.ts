import { Resolver, ObjectType, Field, Query, Ctx, Authorized, Arg, Int } from 'type-graphql'
import MUUID from 'uuid-mongodb'

import { AdminOnlyArgs } from '../auth'
import { IApolloContext } from 'src/graphql/types'
import { CardVersion } from 'src/models/CardVersion'
import { User } from 'src/models/User'
import { Role } from 'src/util/enums'

@ObjectType()
class CardVersionStats {
  @Field()
  id: string

  @Field((type) => Int)
  numCardsOrdered: number

  @Field((type) => Int)
  numTaps: number
}

@Resolver()
class CardVersionResolver {
  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Query(() => CardVersion, { nullable: true })
  async cardVersion(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Arg('cardVersionId', { nullable: true }) cardVersionId: string | null,
    @Ctx() context: IApolloContext
  ) {
    const requesterUserId = context.user._id
    const requestedUserId = userId ?? requesterUserId

    if (cardVersionId == null) {
      // Find the default card version for this user
      const user = await User.mongo
        .findById(MUUID.from(requestedUserId))
        .populate('defaultCardVersion')

      return (user.defaultCardVersion as CardVersion) || null
    } else {
      return await CardVersion.mongo.findById(MUUID.from(cardVersionId))
    }
  }

  // Return a list of all card versions belonging to the specified user,
  // or context.user by default
  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Query(() => [CardVersion])
  async cardVersions(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<CardVersion[]> {
    const requesterUserId = context.user._id
    const requestedUserId = userId ?? requesterUserId

    const cardVersionsBelongingToUser = await CardVersion.mongo.find({
      user: MUUID.from(requestedUserId),
    })
    return cardVersionsBelongingToUser
  }

  // Return a list of all card versions belonging to the specified user,
  // or context.user by default
  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Query(() => [CardVersionStats])
  async cardVersionsStats(
    // If null, default to context.user
    @Arg('userId', { nullable: true }) userId: string | null,
    // If null, get stats for all card versions belong to user
    @Arg('cardVersionIds', (type) => [String], { nullable: true }) cardVersionIds: string[],
    @Ctx() context: IApolloContext
  ): Promise<CardVersionStats[]> {
    const requesterUserId = context.user._id
    const requestedUserId = userId ?? requesterUserId

    const ids =
      cardVersionIds ??
      (
        await CardVersion.mongo.find({
          user: MUUID.from(requestedUserId),
        })
      ).map((cardVersion) => cardVersion.id as string)

    return ids.map((id) => ({
      id,
      // TODO: Correctly source this data rather than mocking 0's
      numCardsOrdered: 0,
      numTaps: 0,
    }))
  }
}
export default CardVersionResolver
