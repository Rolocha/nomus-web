import { DocumentType } from '@typegoose/typegoose'
import { Card, Sheet, SheetOrder } from 'src/models'
import { doNTimes } from 'src/util/array'
import { performTransaction } from 'src/util/db'
import { Role, SheetState } from 'src/util/enums'
import { Arg, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'

const DEFAULT_NUM_CARDS_IN_SHEET = 25

@Resolver((of) => SheetOrder)
class SheetOrderResolver {
  @FieldResolver()
  async sheets(@Root() sheetOrder: SheetOrder) {
    return await Promise.all(sheetOrder.sheets.map((s: string) => Sheet.mongo.findById(s)))
  }

  @FieldResolver({
    description:
      "Returns an array of string arrays representing the NFC URL's that should appear on each sheet",
  })
  async orderPayload(@Root() sheetOrder: DocumentType<SheetOrder>): Promise<Array<string[]>> {
    return sheetOrder.computeOrderPayload()
  }

  @Authorized(Role.Admin)
  @Query(() => SheetOrder, { nullable: true })
  async sheetOrder(@Arg('id', { nullable: false }) id: string): Promise<SheetOrder> {
    return await SheetOrder.mongo.findById(id)
  }

  @Authorized(Role.Admin)
  @Mutation(() => SheetOrder, {
    description:
      'Creates a new SheetOrder, along with the requisite underlying Sheet and Card objects',
  })
  async createSheetOrder(
    @Arg('numSheets', { nullable: false }) numSheets: number,
    @Arg('numCardsInSheet', { nullable: true }) numCardsInSheet: number | null
  ): Promise<SheetOrder> {
    // Create {numSheets} many Sheet objects
    const sheets: DocumentType<Sheet>[] = doNTimes(numSheets, () => new Sheet.mongo())

    // Keep a list of documents we need to call .save() on before we're done
    // We'll do it all at once to be more efficient
    const documentsToSave: DocumentType<any>[] = [...sheets]

    sheets.forEach((sheet) => {
      // Create `NUM_CARDS_IN_SHEET` cards for each sheet
      const cardsInSheet: DocumentType<Card>[] = doNTimes(numCardsInSheet, () => {
        const card = new Card.mongo()
        card.nfcId = `${sheet.id}-${card.id}`
        return card
      })
      sheet.cards = cardsInSheet
      documentsToSave.push(...cardsInSheet)
    })

    return await performTransaction(async () => {
      await Promise.all(documentsToSave.map((document) => document.save()))
      return SheetOrder.mongo.create({
        sheets,
      })
    })
  }

  @Authorized(Role.Admin)
  @Mutation(() => SheetOrder, {
    description: 'Updates the state property of all the sheets within a SheetOrder',
  })
  async transitionSheetOrderState(
    @Arg('sheetOrderId', { nullable: false }) sheetOrderId: string,
    @Arg('futureState', (type) => SheetState, { nullable: false }) futureState: SheetState
  ): Promise<SheetOrder> {
    const sheetOrder = await SheetOrder.mongo.findById(sheetOrderId)
    const sheetIds = sheetOrder.sheets as string[]

    await performTransaction(async () =>
      Sheet.mongo.updateMany(
        {
          _id: {
            $in: sheetIds,
          },
        },
        {
          state: futureState,
        }
      )
    )

    return SheetOrder.mongo.findById(sheetOrderId)
  }
}
export default SheetOrderResolver
