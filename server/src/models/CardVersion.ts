import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { CardSpecBaseType } from 'src/util/enums'
import { Field, ObjectType } from 'type-graphql'
import { BaseModel } from './BaseModel'
import { Ref } from './scalars'
import { TemplateColorScheme, TemplateContactInfoFields } from './subschemas'
import { User } from './User'

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

  @prop({ required: true, ref: 'User', type: String })
  @Field(() => User, { nullable: false })
  user: Ref<User>

  /**
   * Fields specific to custom-designed card versions
   */

  @prop({ required: false })
  @Field({ nullable: true })
  frontImageUrl: string

  @prop({ required: false })
  @Field({ nullable: true })
  backImageUrl: string

  /**
   * Fields specific to template-based card versions
   */

  @prop({ required: false })
  @Field({ nullable: true })
  templateId: string

  @prop({ _id: false, required: false })
  @Field(() => TemplateContactInfoFields, {
    nullable: true,
    description: 'User-specified contact info, only present for template-based card versions',
  })
  contactInfo: TemplateContactInfoFields | null

  @prop({ _id: false, required: false })
  @Field((type) => TemplateColorScheme, {
    nullable: true,
    description: 'User-specified color scheme, only present for template-based card versions',
  })
  colorScheme: TemplateColorScheme | null

  @prop({ required: false })
  @Field({ nullable: true })
  qrCodeUrl: string

  // TODO: Maybe also upload the user's graphic to S3 and store a ref to it on a property here?

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
