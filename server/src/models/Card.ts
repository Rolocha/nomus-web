import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'
import { BaseModel } from './BaseModel'
import CardVersion from './CardVersion'
import { Ref } from './scalars'
import User from './User'

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

  @prop({ _id: false, required: false, ref: () => CardVersion, type: String })
  @Field(() => CardVersion, { nullable: false })
  cardVersion: Ref<CardVersion>

  // nfcId is just `${sheet.id}-{card.id}` but it's a clean/useful abstraction
  // for a Card to always save a reference to its NFC ID (otherwise we'd have to look up
  // which Sheet it's a part of first...)
  @prop({ required: false })
  @Field({ nullable: true })
  nfcId: string

  @prop({ required: false })
  @Field({ nullable: true })
  qrUrl: string
}

// Attach the mongoose model onto the core model itself
Card.mongo = getModelForClass(Card)

export default Card
