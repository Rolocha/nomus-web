import { ObjectType, Field, InputType } from 'type-graphql'
import { prop } from '@typegoose/typegoose'
import { NomusProFeature } from 'src/util/enums'

@InputType('PersonNameInput')
@ObjectType()
export class PersonName {
  @prop({ validate: (v: string) => v.length > 0 })
  @Field()
  first: string

  @prop({ required: false })
  @Field({ nullable: true })
  middle?: string

  @prop({ validate: (v: string) => v.length > 0 })
  @Field()
  last: string
}

// A dictionary of flags to indicate whether the user has already seen/encountered UI scenarios
interface IUserCheckpoints {
  expressedInterestInOrderingNomusCard: boolean
}
@ObjectType()
export class UserCheckpoints implements IUserCheckpoints {
  @prop({ default: false })
  @Field()
  expressedInterestInOrderingNomusCard: boolean
}

type UserCheckpointKey = keyof Required<IUserCheckpoints>
export const USER_CHECKPOINT_KEYS: Array<UserCheckpointKey> = [
  'expressedInterestInOrderingNomusCard',
]

export const isValidUserCheckpointKey = (s: string): s is UserCheckpointKey => {
  return (USER_CHECKPOINT_KEYS as string[]).includes(s)
}

@ObjectType({ description: 'The settings/states for Nomus Pro features' })
export class NomusProFeatureSet implements Record<NomusProFeature, boolean> {
  @prop({ default: false })
  @Field()
  [NomusProFeature.UseCustomTapLink]: boolean
}

export const EMPTY_FEATURE_SET: NomusProFeatureSet = {
  [NomusProFeature.UseCustomTapLink]: false,
}

@InputType('AddressInput')
@ObjectType()
export class Address {
  @prop()
  @Field({ nullable: false })
  line1: string

  @prop()
  @Field({ nullable: true })
  line2?: string

  @prop()
  @Field({ nullable: false })
  city: string

  @prop()
  @Field({ nullable: false })
  state: string

  @prop()
  @Field({ nullable: false })
  postalCode: string
}

@InputType('OrderPriceInput')
@ObjectType()
export class OrderPrice {
  //Price of cards in the order
  @prop({ required: true })
  @Field({ nullable: false })
  subtotal: number

  @prop({ required: true, default: 0 })
  @Field({ nullable: false })
  tax: number

  @prop({ required: true, default: 0 })
  @Field({ nullable: false })
  shipping: number

  @prop({ required: true, default: 0 })
  @Field({ nullable: false })
  discount: number

  @prop({ required: true })
  @Field({ nullable: false })
  total: number
}

@InputType('TemplateContactInfoFieldsInput', {
  description: 'Contact info fields potentially specified when customizing a template card',
})
@ObjectType()
export class TemplateContactInfoFields {
  @prop({ required: false })
  @Field({ nullable: true })
  name: string | null

  @prop({ required: false })
  @Field({ nullable: true })
  line1: string | null

  @prop({ required: false })
  @Field({ nullable: true })
  line2: string | null

  @prop({ required: false })
  @Field({ nullable: true })
  line3: string | null

  @prop({ required: false })
  @Field({ nullable: true })
  line4: string | null

  @prop({ required: false })
  @Field({ nullable: true })
  headline: string | null

  @prop({ required: false })
  @Field({ nullable: true })
  footer: string | null
}

// Keep in sync with the array in client/src/templates/index.test.ts
@InputType('TemplateColorSchemeInput', {
  description: 'Colors defined when customizing a template card',
})
@ObjectType()
export class TemplateColorScheme {
  @prop({ required: true })
  @Field({ nullable: false })
  background: string

  @prop({ required: true })
  @Field({ nullable: false })
  text: string

  @prop({ required: false })
  @Field({ nullable: true })
  accent: string | null

  @prop({ required: false })
  @Field({ nullable: true })
  accent2: string | null

  @prop({ required: false })
  @Field({ nullable: true })
  accent3: string | null

  @prop({ required: false })
  @Field({ nullable: true })
  accent4: string | null
}
