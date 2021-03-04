import { Resolver, Authorized, Mutation, Arg, ObjectType, Field } from 'type-graphql'
import { Role } from 'src/util/enums'
import * as linker from 'src/util/linker'
import { Void } from 'src/models/scalars'

@ObjectType()
class LinkedInfo {
  @Field({ nullable: true })
  userId: string

  @Field({ nullable: true })
  sheetId: string

  @Field({ nullable: true })
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
    const res = await linker.linkSheetToUser(routeStr, shortId)
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
  @Authorized(Role.Admin)
  @Mutation(() => Void, {
    nullable: true,
    description: 'Unlink sheet from user if something went wrong',
  })
  async unlinkSheet(@Arg('sheetId', { nullable: false }) sheetId: string): Promise<void> {
    const res = await linker.unlinkSheet(sheetId)
    if (!res.isSuccess) {
      throw new Error('Error unlinking sheet')
    }
  }
}

export default LinkerResolver
