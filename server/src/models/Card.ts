import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import User from './User'
import CardVersion from './CardVersion'
import { BaseModel } from './BaseModel'
import { Ref } from './scalars'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType({
  description: 'Represents a single business card',
})
export class Card extends BaseModel({
  prefix: 'card',
}) {
  static mongo: ReturnModelType<typeof Card>

  @prop({ _id: false, required: true, ref: () => CardVersion, type: String })
  @Field(() => CardVersion, { nullable: false })
  cardVersion: Ref<CardVersion>

  @prop({ _id: false, required: true, ref: () => User, type: String })
  @Field(() => User, { nullable: false })
  user: Ref<User>
}

// Attach the mongoose model onto the core model itself
Card.mongo = getModelForClass(Card)

export default Card
