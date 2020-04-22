import { Resolver, Query, Arg } from 'type-graphql'

import { CardVersion, User } from 'src/models'

@Resolver()
export default class ContactInfoResolver {
  @Query(() => CardVersion)
  async contactInfo(
    @Arg('username') username: string,
    @Arg('cardNameOrId', { nullable: true }) cardNameOrId?: string
  ) {
    const cardVersion = cardNameOrId
      ? // If cardNameOrId present, find the cardVersion directly, either with its id or its name + associated user
        await CardVersion.mongo.findBySlugOrId(cardNameOrId, username)
      : // Otherwise, just get the default card version for the provided username
        await User.mongo.getDefaultCardVersionForUsername(username)
    return cardVersion
  }
}
