import { Resolver, ObjectType, Field, Query, Ctx, Authorized, Arg, Int } from 'type-graphql'

import { Role } from 'src/util/enums'
import { Sheet } from 'src/models'

@Resolver()
class SheetResolver {
  @Authorized(Role.Admin)
  @Query(() => Sheet, { nullable: true })
  async sheet(@Arg('sheetId', { nullable: false }) sheetId: string) {
    return await Sheet.mongo.findById(sheetId)
  }
}
export default SheetResolver
