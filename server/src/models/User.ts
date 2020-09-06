import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { accessTokenLifespan, authTokenPrivateKey } from 'src/config'
import { Field, ObjectType } from 'type-graphql'
import MUUID from 'uuid-mongodb'
import { CardVersion } from './CardVersion'
import { Ref, UUIDScalar, UUIDType } from './scalars'
import { PersonName } from './subschemas'
import Token from './Token'
import { validateEmail } from './utils'
import { Role } from 'src/util/enums'
import { Result } from 'src/util/error'

export interface UserCreatePayload {
  _id?: UUIDType
  name: PersonName
  email: string
  password: string
}

export const ReservedRoutes = [
  'dashboard',
  'profile',
  'faq',
  'careers',
  'jobs',
  'login',
  'auth',
  'api',
  'signup',
  'register',
  'registration',
  'faq',
  'dashboard',
  'card-builder',
  'get-started',
  'about',
  'profile',
  'design',
  'hello',
]

type ValidateUsernameResult = Result<
  null,
  | 'username-too-short'
  | 'empty-username'
  | 'reserved-route'
  | 'non-unique-username'
  | 'unknown-error'
>
export const validateUsername = async (usernameVal: string): Promise<ValidateUsernameResult> => {
  const exists = await User.mongo.find({ username: usernameVal }).limit(1)

  if (exists.length > 0) {
    return Result.fail('non-unique-username')
  }

  if (ReservedRoutes.includes(usernameVal)) {
    return Result.fail('reserved-route')
  }

  if (usernameVal == null) {
    return Result.fail('empty-username')
  }

  if (usernameVal.length <= 5) {
    return Result.fail('username-too-short')
  }

  return Result.ok()
}

@pre<User>('save', async function (next) {
  if (this.isNew && this.username == null) {
    this.username =
      this.name.first + '.' + this.name.last + '.' + Math.random().toString(36).substring(2, 8)
    next()
  }
  next()
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

  @prop({ _id: false, required: true })
  @Field(() => PersonName, { nullable: true })
  name: PersonName

  @prop()
  @Field({ nullable: true })
  headline: string

  @prop()
  @Field({ nullable: true })
  bio: string

  @prop()
  @Field({ nullable: true })
  profilePicUrl: string

  @prop({ match: /^\d{10,11}$/ })
  @Field({ nullable: true })
  phoneNumber: string

  @prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: validateEmail,
  })
  @Field({ nullable: true })
  email: string

  @prop({
    unique: true,
  })
  @Field({ nullable: true })
  username: string

  @prop({ required: true })
  password: string

  @prop({ type: Buffer, ref: 'CardVersion' })
  @Field(() => CardVersion, { nullable: true })
  defaultCardVersion: Ref<CardVersion>

  @prop({ required: false })
  @Field()
  vcfUrl: string

  @prop({ default: [Role.User], required: true })
  @Field((type) => [Role], { nullable: false })
  roles: Role[]

  @prop({ default: true, required: true })
  @Field({ nullable: false })
  activated: boolean

  public static async newUser(
    this: ReturnModelType<typeof User>,
    userInfo: UserCreatePayload
  ): Promise<DocumentType<User>> {
    const user = await this.create(userInfo)
    return user
  }

  public static async getDefaultCardVersionForUsername(
    this: ReturnModelType<typeof User>,
    username: string
  ) {
    const user = await this.findOne({ username })
    return await CardVersion.mongo.findById(MUUID.from(user.defaultCardVersion as UUIDType))
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

  public generateAccessToken(): string {
    const body = { _id: MUUID.from(this._id).toString(), roles: this.roles ?? [] }
    return jwt.sign(body, authTokenPrivateKey, {
      expiresIn: accessTokenLifespan,
    })
  }

  public async generateRefreshToken(): Promise<string> {
    // Get the PRE-hashed refresh token since this is the generation step where we need
    // to send it to the client
    const { preHashToken } = await Token.mongo.createNewTokenForUser(MUUID.from(this._id))
    return preHashToken
  }
}

// Attach the mongoose model onto the core model itself
export const UserModel = getModelForClass(User)
User.mongo = UserModel

export default User
