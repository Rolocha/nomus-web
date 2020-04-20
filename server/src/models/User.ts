import MUUID from 'uuid-mongodb'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {
  pre,
  prop,
  modelOptions,
  ReturnModelType,
  Ref,
  getModelForClass,
} from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import { authTokenPrivateKey } from 'src/config'
import { validateEmail } from 'src/models/utils'
import { UUIDScalar, UUIDType } from 'src/models/scalars'
import { PersonName } from 'src/models/subschemas'

@pre<User>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
  }
  next()
})
@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class User {
  static mongo: ReturnModelType<typeof User>

  @prop({ required: true, default: () => MUUID.v4() })
  @Field((type) => UUIDScalar)
  readonly _id: UUIDType

  @prop({ _id: false, required: true })
  @Field(() => PersonName, { nullable: true })
  name: Ref<PersonName>

  @prop({ match: /^\d{10,11}$/ })
  @Field()
  phoneNumber: string

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
  @Field({ nullable: true })
  username: string

  @prop({ required: true })
  password: string

  public static async findByCredentials(
    this: ReturnModelType<typeof User>,
    email: string,
    password: string
  ) {
    // Search for a user by email and password.
    const user = await this.findOne({ email })
    if (!user) {
      throw new Error('Invalid login credentials')
    }
    const doesPasswordMatch = await bcrypt.compare(password, user.password)
    if (!doesPasswordMatch) {
      throw new Error('Invalid login credentials')
    }
    return user
  }

  public generateAuthToken() {
    const body = { _id: MUUID.from(this._id).toString() }
    // TODO: Attach expiration date field (exp)
    return jwt.sign(body, authTokenPrivateKey)
  }
}

// Attach the mongoose model onto the core model itself
User.mongo = getModelForClass(User)

export default User
