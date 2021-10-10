import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { BaseModel } from './BaseModel'
import { CardVersion } from './CardVersion'
import { Ref } from './scalars'
import { User } from './User'

// @ts-ignore
export class UserProfile extends BaseModel({
  prefix: 'userprof',
}) {
  static mongo: ReturnModelType<typeof UserProfile>
  // A reference to the User object this profile belongs to
  @prop({ required: true, ref: () => User, type: String })
  user: Ref<User>

  @prop()
  bio: string

  // The S3 key pointing to the user's profile pic, requires fetching server-side and attaching
  // on profilePicUrl when sending to a client
  @prop()
  profilePicS3Key: string

  @prop({ match: /^\d{10,11}$/ })
  phoneNumber: string

  @prop({ required: false, ref: () => CardVersion, type: String })
  defaultCardVersion: Ref<CardVersion>

  @prop({ required: false })
  vcfUrl: string

  @prop({ required: false })
  email: string
}

// Attach the mongoose model onto the core model itself
export const UserProfileModel = getModelForClass(UserProfile)
UserProfile.mongo = UserProfileModel

export default UserProfile
