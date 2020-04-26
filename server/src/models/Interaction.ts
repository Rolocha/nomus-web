import MUUID from 'uuid-mongodb'
import { prop, modelOptions, ReturnModelType, Ref, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import { UUIDScalar, UUIDType } from './scalars'
import Card from './Card'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class Interaction {
  static mongo: ReturnModelType<typeof Interaction>

  @prop({ required: true, default: () => MUUID.v4() })
  @Field((type) => UUIDScalar)
  readonly _id: UUIDType

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
