import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { CardSpecBaseType } from 'src/util/enums'
import { Field, ObjectType } from 'type-graphql'
import { BaseModel } from './BaseModel'
import { Ref } from './scalars'
import { PrintAddress, PersonName } from './subschemas'
import { User } from './User'
import { validateEmail } from './utils'

// @ts-ignore
@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true, _id: String } })
@ObjectType({
  description: 'Represents a single card design which may result in numerous printed Cards',
})
export class CardVersion extends BaseModel({
  prefix: 'cardv',
}) {
  static mongo: ReturnModelType<typeof CardVersion>

  @Field()
  createdAt: Date

  @prop()
  @Field({ nullable: true })
  cardSlug: string

  @prop({
    enum: CardSpecBaseType,
    type: String,
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
  @Field(() => PrintAddress, { nullable: false })
  address: PrintAddress

  @prop({ required: false })
  @Field({ nullable: true })
  frontImageUrl: string

  @prop({ required: false })
  @Field({ nullable: true })
  backImageUrl: string

  @prop({ required: false })
  @Field({ nullable: true })
  vcfUrl: string

  @prop({ required: true, ref: 'User', type: String })
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
        user: userWithThatUsername.id,
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
