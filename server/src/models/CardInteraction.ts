import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { CardInteractionType } from 'src/util/enums'
import { Field, ObjectType } from 'type-graphql'
import { BaseModel } from './BaseModel'
import Card from './Card'
import CardVersion from './CardVersion'
import { Ref } from './scalars'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class CardInteraction extends BaseModel({
  prefix: 'ctap',
}) {
  static mongo: ReturnModelType<typeof CardInteraction>

  @prop({ _id: false, required: false, ref: () => Card, type: String })
  @Field(() => Card, { nullable: true })
  card: Ref<Card>

  @prop({ _id: false, required: true, ref: () => Card, type: String })
  @Field(() => Card, { nullable: false })
  cardVersion: Ref<CardVersion>

  @prop({
    default: CardInteractionType.Unknown,
    enum: CardInteractionType,
    type: String,
    required: true,
  })
  @Field((type) => [CardInteractionType], {
    nullable: false,
    defaultValue: CardInteractionType.Unknown,
    description: 'How the receiver of the card interacted with it',
  })
  interactionType: CardInteractionType
}

// Attach the mongoose model onto the core model itself
CardInteraction.mongo = getModelForClass(CardInteraction)

export default CardInteraction
