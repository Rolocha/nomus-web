import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import User from './User'
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

  @prop({ _id: false, required: false, ref: () => User, type: String })
  @Field(() => User, { nullable: true })
  user: Ref<User>

  @prop({ required: false })
  @Field({ nullable: true })
  nfcUrl: string

  @prop({ required: false })
  @Field({ nullable: true })
  qrUrl: string
}

// Attach the mongoose model onto the core model itself
Card.mongo = getModelForClass(Card)

export default Card
