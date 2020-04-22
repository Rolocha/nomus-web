import MUUID from 'uuid-mongodb'
import { prop, modelOptions, ReturnModelType, Ref, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import { validateEmail } from 'src/models/utils'
import { UUIDScalar, UUIDType } from 'src/models/scalars'
import { PersonName, Address } from 'src/models/subschemas'
import { UserRoute, User } from 'src/models'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class CardVersion {
  static mongo: ReturnModelType<typeof CardVersion>

  @prop({ required: true, default: () => MUUID.v4() })
  @Field((type) => UUIDScalar)
  readonly _id: UUIDType

  @prop()
  @Field({ nullable: true })
  cardSlug: string

  @prop({ _id: false, required: true })
  @Field(() => PersonName, { nullable: true })
  name: Ref<PersonName>

  @prop({ match: /^\d{10,11}$/ })
  @Field()
  phoneNumber: string

  @prop({
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

  @prop({ _id: false })
  @Field(() => Address, { nullable: false })
  address: Ref<Address>

  @prop({ required: true })
  @Field()
  imageUrl: string

  @prop({ required: true })
  @Field()
  vcfUrl: string

  @prop({ _id: false, required: true })
  @Field(() => UserRoute, { nullable: false })
  userRoute: Ref<UserRoute>

  @prop({ _id: false, required: true, ref: 'User' })
  @Field(() => User, { nullable: false })
  user: UUIDType

  static async findBySlugOrId(
    this: ReturnModelType<typeof CardVersion>,
    slugOrId: string,
    username?: string
  ) {
    if (username) {
      const userWithThatUsername = await User.mongo.findOne({ username })
      const cardVersion = await this.findOne({
        cardSlug: slugOrId,
        user: MUUID.from(userWithThatUsername._id),
      })
      return cardVersion
    }

    return await this.findOne({ _id: slugOrId })
  }
}

// Attach the mongoose model onto the core model itself
CardVersion.mongo = getModelForClass(CardVersion)

export default CardVersion
