import { Resolver, Authorized, Mutation, Arg, ObjectType, Field } from 'type-graphql'
import { Role } from 'src/util/enums'
import { linkSheetToUser } from 'src/util/linker'

@ObjectType()
class LinkedInfo {
  @Field()
  userId: string

  @Field()
  sheetId: string
}

@Resolver()
class LinkerResolver {
  @Authorized(Role.PrintTech)
  @Mutation(() => LinkedInfo, {
    description: 'When a technician is done printing, link the cards to their user',
  })
  async linkSheetToUser(
    @Arg('routeStr', { nullable: false }) routeStr: string,
    @Arg('shortId', { nullable: false }) shortId: string
  ): Promise<LinkedInfo> {
    return await linkSheetToUser(routeStr, shortId)
  }
}

export default LinkerResolver
