import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'
import MUUID from 'uuid-mongodb'
import { Ref, UUIDScalar, UUIDType } from './scalars'
import { Address, PersonName } from './subschemas'
import User from './User'
import { validateEmail } from './utils'
import { CardSpecBaseType } from 'src/util/enums'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
export class CardVersion {
  static mongo: ReturnModelType<typeof CardVersion>

  @Field()
  createdAt: Date

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

  @prop({
    enum: [CardSpecBaseType.Custom, CardSpecBaseType.Template],
    required: true,
    default: CardSpecBaseType.Custom,
  })
  @Field((type) => CardSpecBaseType, { nullable: false })
  baseType: CardSpecBaseType

  @prop({ _id: false, required: false })
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
  @Field({ nullable: true })
  vcfNotes: string

  @prop({ _id: false })
  @Field(() => Address, { nullable: false })
  address: Address

  @prop({ required: false })
  @Field({ nullable: true })
  frontImageUrl: string

  @prop({ required: false })
  @Field({ nullable: true })
  backImageUrl: string

  @prop({ required: false })
  @Field({ nullable: true })
  vcfUrl: string

  @prop({ required: true, ref: 'User', type: Buffer })
  @Field(() => User, { nullable: false })
  user: Ref<User>

  @prop({ required: false })
  @Field({ nullable: true })
  templateId: string

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
