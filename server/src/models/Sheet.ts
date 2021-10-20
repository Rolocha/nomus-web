import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { WhatIsIt } from '@typegoose/typegoose/lib/internal/constants'
import { SheetState } from 'src/util/enums'
import { Field, ObjectType } from 'type-graphql'
import { BaseModel } from './BaseModel'
import { Card } from './Card'
import { CardVersion } from './CardVersion'
import Order from './Order'
import { Ref } from './scalars'

@ObjectType({
  description: 'Represents a single sheet from supplier that contains 25 cards',
})
export class Sheet extends BaseModel({
  prefix: 'sheet',
}) {
  static mongo: ReturnModelType<typeof Sheet>

  @prop({ required: true, type: [String], ref: () => Card }, WhatIsIt.ARRAY)
  @Field((type) => [Card], { nullable: false })
  cards: Array<Ref<Card>>

  @prop({ _id: false, required: false, ref: () => CardVersion, type: String })
  @Field(() => CardVersion, { nullable: true })
  cardVersion: Ref<CardVersion>

  @prop({ _id: false, required: false, ref: () => Order, type: String })
  @Field(() => Order, { nullable: true })
  order: Ref<Order>

  // This correlates with SheetState at server/src/util/enums.ts
  @prop({ enum: SheetState, type: String, required: true, default: SheetState.Created })
  @Field((type) => SheetState, { nullable: false })
  state: SheetState
}

// Attach the mongoose model onto the core model itself
Sheet.mongo = getModelForClass(Sheet)

export default Sheet
