import { Resolver, Authorized, Mutation, Arg, ObjectType, Field } from 'type-graphql'
import { Role } from 'src/util/enums'
import { linkSheetToUser } from 'src/util/linker'

@ObjectType()
class LinkedInfo {
  @Field()
  userId: string

  @Field()
  sheetId: string

  @Field()
  error: string
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
    const res = await linkSheetToUser(routeStr, shortId)
    if (res.isSuccess) {
      return {
        error: null,
        ...res.value,
      }
    } else {
      return {
        error: res.error.name + ': ' + res.error.message,
        userId: null,
        sheetId: null,
      }
    }
  }
}

export default LinkerResolver
