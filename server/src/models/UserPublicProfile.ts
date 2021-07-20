import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'
import { BaseModel } from './BaseModel'

// @ts-ignore
@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true, _id: String } })
@ObjectType()
export class UserPublicProfile extends BaseModel({
  prefix: 'pubprof',
}) {
  static mongo: ReturnModelType<typeof UserPublicProfile>

  @prop()
  @Field({ nullable: true })
  headline: string

  @prop()
  @Field({ nullable: true })
  bio: string

  @prop({ match: /^\d{10,11}$/ })
  @Field({ nullable: true })
  phoneNumber: string

  @prop({ required: false })
  @Field()
  vcfUrl: string
}

// Attach the mongoose model onto the core model itself
export const UserPublicProfileModel = getModelForClass(UserPublicProfile)
UserPublicProfile.mongo = UserPublicProfileModel

export default UserPublicProfile
