import {
  Resolver,
  ObjectType,
  Field,
  Query,
  Ctx,
  Authorized,
  Arg,
  Int,
  FieldResolver,
  Root,
} from 'type-graphql'

import { AdminOnlyArgs } from '../auth'
import { IApolloContext } from 'src/graphql/types'
import { CardVersion } from 'src/models/CardVersion'
import { User } from 'src/models/User'
import { Role } from 'src/util/enums'
import { Card, CardInteraction } from 'src/models'

@ObjectType()
class CardVersionStats {
  @Field()
  id: string

  @Field((type) => Int)
  numCardsOrdered: number

  @Field((type) => Int)
  numTaps: number
}

@Resolver((of) => CardVersion)
class CardVersionResolver {
  @FieldResolver()
  async user(@Root() cardVersion: CardVersion) {
    return User.mongo.findById(cardVersion.user)
  }

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
      const user = await User.mongo.findById(requestedUserId).populate('defaultCardVersion')

      return (user.defaultCardVersion as CardVersion) || null
    } else {
      return await CardVersion.mongo.findById(cardVersionId)
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
      user: requestedUserId,
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
          user: requestedUserId,
        })
      ).map((cardVersion) => cardVersion.id as string)

    const numCardsOrdered = await Promise.all(
      ids.map((id) => Card.mongo.count({ cardVersion: id }))
    )

    const interactions = await Promise.all(
      ids.map((id) => CardInteraction.mongo.count({ cardVersion: id }))
    )

    return ids.map((id, index) => ({
      id,
      numCardsOrdered: numCardsOrdered[index],
      numTaps: interactions[index],
    }))
  }
}
export default CardVersionResolver
