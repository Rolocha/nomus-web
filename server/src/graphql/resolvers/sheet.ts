import { Resolver, Query, Authorized, Arg, FieldResolver, Root, Mutation } from 'type-graphql'

import { Role, SheetState } from 'src/util/enums'
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

  @Authorized(Role.Admin)
  @Mutation(() => Sheet, {
    description: 'Updates the state property of the specified sheet',
  })
  async transitionSheetState(
    @Arg('sheetId', { nullable: false }) sheetId: string,
    @Arg('futureState', (type) => SheetState, { nullable: false }) futureState: SheetState
  ): Promise<Sheet> {
    const sheet = await Sheet.mongo.findOneAndUpdate(
      { _id: sheetId },
      {
        state: futureState,
      },
      // Return the updated copy of Sheet, not the original
      { new: true }
    )
    return sheet
  }
}
export default SheetResolver
