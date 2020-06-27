import MUUID from 'uuid-mongodb'
import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import { UUIDScalar, UUIDType, Ref } from './scalars'
import User from './User'
import CardVersion from './CardVersion'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class Card {
  static mongo: ReturnModelType<typeof Card>

  @prop({ required: true, default: () => MUUID.v4() })
  @Field((type) => UUIDScalar)
  readonly _id: UUIDType

  @prop({ _id: false, required: true })
  @Field(() => CardVersion, { nullable: false })
  cardVersion: Ref<CardVersion>

  @prop({ _id: false, required: true })
  @Field(() => User, { nullable: false })
  user: Ref<User>
}

// Attach the mongoose model onto the core model itself
Card.mongo = getModelForClass(Card)

export default Card
