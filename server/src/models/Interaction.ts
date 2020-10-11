import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import { Ref } from './scalars'
import Card from './Card'
import { BaseModel } from './BaseModel'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class Interaction extends BaseModel({
  prefix: 'intxn',
}) {
  static mongo: ReturnModelType<typeof Interaction>

  @prop({ _id: false, required: true })
  @Field(() => Card, { nullable: false })
  sourceCard: Ref<Card>

  @prop({ _id: false, required: true })
  @Field(() => Card, { nullable: false })
  receiverCard: Ref<Card>

  @prop()
  @Field()
  ineractionType: string

  @prop()
  @Field()
  httpHeader: string
}

// Attach the mongoose model onto the core model itself
Interaction.mongo = getModelForClass(Interaction)

export default Interaction
