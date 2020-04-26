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
import { ObjectType, Field, registerEnumType } from 'type-graphql'

import { authTokenPrivateKey, accessTokenLifespan } from 'src/config'

import CardVersion from './CardVersion'
import Token from './Token'
import { PersonName } from './subschemas'
import { validateEmail } from './utils'
import { UUIDScalar, UUIDType } from './scalars'

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
registerEnumType(Role, {
  name: 'Role',
  description: 'User access control roles',
})

@pre<User>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
  }
  next()
})
@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
export class User {
  static mongo: ReturnModelType<typeof User>

  @prop({ required: true, default: MUUID.v4 })
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

  @prop()
  @Field(() => CardVersion)
  defaultCardVersion: UUIDType

  @prop({ default: ['user'], required: true })
  @Field((type) => [Role])
  roles: Role[]

  public static async getDefaultCardVersionForUsername(
    this: ReturnModelType<typeof User>,
    username: string
  ) {
    const user = await this.findOne({ username })
    return await CardVersion.mongo.findById(MUUID.from(user.defaultCardVersion))
  }

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

  public generateAccessToken() {
    const body = { _id: MUUID.from(this._id).toString(), roles: this.roles ?? [] }
    return jwt.sign(body, authTokenPrivateKey, {
      expiresIn: accessTokenLifespan,
    })
  }

  public async generateRefreshToken() {
    const refreshToken = await Token.mongo.create({ client: MUUID.from(this._id) })
    return refreshToken.value
  }
}

// Attach the mongoose model onto the core model itself
User.mongo = getModelForClass(User)

export default User
