import MUUID from 'uuid-mongodb'
import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import { validateEmail } from './utils'
import { UUIDScalar, UUIDType, Ref } from './scalars'
import { PersonName, Address } from './subschemas'
import User from './User'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
export class CardVersion {
  static mongo: ReturnModelType<typeof CardVersion>

  @prop({ required: true, default: MUUID.v4 })
  @Field((type) => UUIDScalar)
  _id: UUIDType

  // Override the 'id' virtual property getters/setters since Mongoose doesn't
  // know how to handle our custom MUUID implementation
  @Field() // Expose the pretty underscore-less string version on GraphQL schema
  get id(): string {
    return MUUID.from(this._id).toString()
  }

  set id(id: string) {
    this._id = MUUID.from(id)
  }

  @prop()
  @Field({ nullable: true })
  cardSlug: string

  @prop({ _id: false, required: true })
  @Field(() => PersonName, { nullable: true })
  name: PersonName

  @prop({ match: /^\d{10,11}$/ })
  @Field()
  phoneNumber: string

  @prop({
    trim: true,
    lowercase: true,
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

  @prop({ required: false })
  @Field()
  frontImageUrl: string

  @prop({ required: false })
  @Field()
  backImageUrl: string

  @prop({ required: false })
  @Field()
  vcfUrl: string

  @prop({ required: true, ref: 'User', type: Buffer })
  @Field(() => User, { nullable: false })
  user: Ref<User>

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
export const CardVersionModel = getModelForClass(CardVersion)
CardVersion.mongo = CardVersionModel

export default CardVersion
