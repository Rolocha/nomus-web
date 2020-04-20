import MUUID from 'uuid-mongodb'
import { prop, modelOptions, ReturnModelType, Ref, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import { validateEmail } from 'src/models/utils'
import { UUIDScalar, UUIDType } from 'src/models/scalars'
import { PersonName, Address } from 'src/models/subschemas'
import { UserRoute } from 'src/models'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class CardVersion {
  static mongo: ReturnModelType<typeof CardVersion>

  @prop({ required: true, default: () => MUUID.v4() })
  @Field((type) => UUIDScalar)
  readonly _id: UUIDType

  @prop({ _id: false, required: true })
  @Field(() => PersonName, { nullable: true })
  name: Ref<PersonName>

  @prop({ match: /^\d{10,11}$/ })
  @Field()
  cardPhoneNumber: string

  @prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: validateEmail,
  })
  @Field()
  email: string

  @prop()
  @Field()
  title: string

  @prop()
  @Field()
  company: string

  @prop()
  @Field()
  vcfNotes: string

  @prop({ _id: false, required: true })
  @Field(() => Address, { nullable: false })
  address: Ref<Address>

  @prop({ _id: false, required: true })
  @Field(() => UserRoute, { nullable: false })
  userRoute: Ref<UserRoute>
}

// Attach the mongoose model onto the core model itself
CardVersion.mongo = getModelForClass(CardVersion)

export default CardVersion
