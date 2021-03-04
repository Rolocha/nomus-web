import { Resolver, Query, Authorized, Arg, FieldResolver, Root } from 'type-graphql'

import { Role } from 'src/util/enums'
import { CardVersion, Order, Sheet } from 'src/models'

@Resolver((of) => Sheet)
class SheetResolver {
  @FieldResolver()
  async order(@Root() sheet: Sheet) {
    return Order.mongo.findById(sheet.order)
  }
  @FieldResolver()
  async cardVersion(@Root() sheet: Sheet) {
    return CardVersion.mongo.findById(sheet.cardVersion)
  }

  @Authorized(Role.Admin)
  @Query(() => Sheet, { nullable: true })
  async sheet(@Arg('sheetId', { nullable: false }) sheetId: string): Promise<Sheet> {
    return await Sheet.mongo.findById(sheetId)
  }
}
export default SheetResolver
