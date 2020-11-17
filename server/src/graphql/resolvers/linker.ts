import { Resolver, Authorized, Mutation, Arg, ObjectType, Field } from 'type-graphql'
import { Role } from 'src/util/enums'
import { getCardVersionFromShortId, linkSheetToCardVersion } from 'src/util/linker-utils'
import { Sheet, User } from 'src/models'
import { Ref } from '@typegoose/typegoose'

@ObjectType()
class LinkedInfo {
  @Field()
  userId: Ref<User>

  @Field()
  sheetId: string
}

@Resolver()
class LinkerResolver {
  @Authorized(Role.Admin)
  @Mutation(() => LinkedInfo, {
    description: 'When a technician is done printing, link the cards to their user',
  })
  async linkSheetToUser(
    @Arg('cardStr', { nullable: false }) cardStr: string,
    @Arg('shortId', { nullable: false }) shortId: string
  ): Promise<LinkedInfo> {
    const regex = /sheet_.*-card.*/
    const error = cardStr.match(regex)
    if (error) {
      throw new Error(`Incorrectly formatted cardStr: ${cardStr}`)
    }
    const [sheetId] = cardStr.split('-')
    const cardVersion = await getCardVersionFromShortId(shortId)

    const sheet = await Sheet.mongo.findById(sheetId)

    await linkSheetToCardVersion(sheet, cardVersion)

    return { userId: cardVersion.user, sheetId: sheetId }
  }
}

export default LinkerResolver
