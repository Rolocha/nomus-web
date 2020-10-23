import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'
import { BaseModel } from './BaseModel'
import { Card } from './Card'
import { CardVersion } from './CardVersion'
import { Ref } from './scalars'
import { WhatIsIt } from '@typegoose/typegoose/lib/internal/constants'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType({
  description: 'Represents a single sheet from supplier that contains 25 cards',
})
export class Sheet extends BaseModel({
  prefix: 'sheet',
}) {
  static mongo: ReturnModelType<typeof Sheet>

  @prop({ required: true }, WhatIsIt.ARRAY)
  @Field((type) => [Card], { nullable: false })
  cards: Card[]

  @prop({ _id: false, required: true, ref: () => CardVersion, type: String })
  @Field(() => CardVersion, { nullable: false })
  cardVersion: Ref<CardVersion>
}

// Attach the mongoose model onto the core model itself
Sheet.mongo = getModelForClass(Sheet)

export default Sheet
