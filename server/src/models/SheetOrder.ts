import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose'
import { WhatIsIt } from '@typegoose/typegoose/lib/internal/constants'
import { Field, ObjectType } from 'type-graphql'
import { BaseModel } from './BaseModel'
import { Card } from './Card'
import { Ref } from './scalars'
import { Sheet } from './Sheet'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType({
  description: 'Represents an order sent to our sheets supplier',
})
export class SheetOrder extends BaseModel({
  prefix: 'sheetord',
}) {
  static mongo: ReturnModelType<typeof SheetOrder>

  @prop({ required: true, type: () => [String], ref: () => Sheet }, WhatIsIt.ARRAY)
  @Field((type) => [Sheet], { nullable: false })
  sheets: Array<Ref<Sheet>>

  // Note there is no prop(): we don't save this in the DB since
  // it is easily computed from `sheets` each time we need it
  @Field(() => [[String]], {
    nullable: false,
    description:
      "The data required to provide to the supplier, in a format that's easy to load into a table in Retool for CSV download",
  })
  orderPayload: Array<Array<string>>

  // Returns an array of string arrays representing the NFC URL's that should appear on each sheet, e.g
  // [
  //   ['https://nomus.me/d/sheet_abc-card_xyz', ...24 more URLs],
  //   ...(N - 1) more rows for a SheetOrder of size N
  // ]
  async computeOrderPayload(this: DocumentType<SheetOrder>): Promise<typeof this['orderPayload']> {
    const sheets: Sheet[] = (
      await SheetOrder.mongo.findById(this.id).populate({
        path: 'sheets',
        populate: {
          path: 'cards',
        },
      })
    ).sheets as Sheet[] // Need to explicitly cast to Sheet[] since TS can't auto-infer it from the .populate('sheets')

    return sheets.map((sheet) =>
      (sheet.cards as Card[]).map((card) => `https://nomus.me/d/${card.nfcId}`)
    )
  }
}

// Attach the mongoose model onto the core model itself
SheetOrder.mongo = getModelForClass(SheetOrder)

export default SheetOrder
