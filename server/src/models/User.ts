import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose'
import { WhatIsIt } from '@typegoose/typegoose/lib/internal/constants'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import * as fs from 'fs'
import { FileUpload } from 'graphql-upload'
import jwt from 'jsonwebtoken'
import ms from 'ms'
import {
  ACCESS_TOKEN_LIFESPAN,
  AUTH_TOKEN_PRIVATE_KEY,
  BASE_URL,
  EMAIL_VERIFICATION_TOKEN_LIFESPAN,
} from 'src/config'
import NomusProSubscription from 'src/models/NomusProSubscription'
import { getCurrentDateForDateInput } from 'src/util/date'
import { Role } from 'src/util/enums'
import { ErrorsOf, EventualResult, Result } from 'src/util/error'
import * as S3 from 'src/util/s3'
import { SendgridTemplate, sgMail } from 'src/util/sendgrid'
import { Field, ObjectType } from 'type-graphql'
import { URLSearchParams } from 'url'
import { BaseModel } from './BaseModel'
import { CardVersion } from './CardVersion'
import { Connection } from './Connection'
import RefreshToken from './RefreshToken'
import { Ref } from './scalars'
import { PersonName, UserCheckpoints } from './subschemas'
import { validateEmail, validateUsername, ValidateUsernameResult } from './validation'

export interface UserCreatePayload {
  id?: string
  name: PersonName
  email: string
  password: string
  username?: string
  headline?: string
  bio?: string
  phoneNumber?: string
}

@pre<User>('save', async function (next) {
  if (this.isNew && this.username == null) {
    this.username = [this.name.first, this.name.last, Math.random().toString(36).substring(2, 8)]
      .join('-')
      .toLowerCase()
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
// @ts-ignore
@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true, _id: String } })
@ObjectType()
export class User extends BaseModel({
  prefix: 'user',
}) {
  static mongo: ReturnModelType<typeof User>

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
  position?: string | null

  @prop()
  @Field({ nullable: true })
  company?: string | null

  @Field({ nullable: true, description: "A URL pointing to the user's profile picture" })
  profilePicUrl: string

  // The S3 key pointing to the user's profile pic, requires fetching server-side and attaching
  // on profilePicUrl when sending to a client
  @prop()
  profilePicS3Key: string

  // Follows E.164 format - https://en.wikipedia.org/wiki/E.164
  @prop({ match: /^\+?[1-9]\d{1,14}$/ })
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
    required: true,
    default: false,
  })
  @Field({ nullable: false })
  isEmailVerified: boolean

  @prop({ required: false, default: () => crypto.randomBytes(20).toString('hex') })
  emailVerificationToken: string | null

  @prop({ required: false, default: () => Date.now() + EMAIL_VERIFICATION_TOKEN_LIFESPAN })
  emailVerificationTokenExpiresAtMs: number

  @prop({
    unique: true,
  })
  @Field({ nullable: true })
  username: string

  @prop({ required: true })
  password: string

  @prop({ required: false, ref: 'CardVersion', type: String })
  @Field(() => CardVersion, { nullable: true })
  defaultCardVersion: Ref<CardVersion>

  @prop({ required: false })
  @Field()
  vcfUrl: string

  @prop({ default: [Role.User], enum: Role, type: String, required: true }, WhatIsIt.ARRAY)
  @Field((type) => [Role], { nullable: false })
  roles: Role[]

  @prop({ default: true, required: true })
  @Field({ nullable: false })
  activated: boolean

  @prop({ _id: false, required: true, default: {} })
  @Field(() => UserCheckpoints, { nullable: false })
  checkpoints: UserCheckpoints

  @prop({ required: false })
  @Field({ nullable: true })
  website?: string

  public static async createNewUser(
    this: ReturnModelType<typeof User>,
    userInfo: UserCreatePayload
  ): EventualResult<DocumentType<User>, ErrorsOf<ValidateUsernameResult> | 'non-unique-email'> {
    if (userInfo.email) {
      const lookupUser = await User.mongo.findOne({ email: userInfo.email })
      if (lookupUser) {
        return Result.fail('non-unique-email')
      }
    }

    if (userInfo.username) {
      const usernameValidationResult = await validateUsername(userInfo.username)
      if (usernameValidationResult.error) {
        return Result.fail(usernameValidationResult.error.name)
      }
    }

    const user = await this.create({
      username: this.defaultUsername(userInfo.name),
      ...userInfo,
    })

    // Auto-create a Connection to self
    await Connection.mongo.create({
      from: user.id,
      to: user.id,
      meetingDate: getCurrentDateForDateInput(),
    })
    return Result.ok(user)
  }

  public static async getDefaultCardVersionForUsername(
    this: ReturnModelType<typeof User>,
    username: string
  ) {
    const user = (await (await this.findOne({ username }))
      .populate('defaultCardVersion')
      .execPopulate()) as DocumentType<User>
    return user.defaultCardVersion
  }

  public static async findByCredentials(
    this: ReturnModelType<typeof User>,
    email: string,
    password: string
  ): EventualResult<User, 'invalid-login-credentials'> {
    // Search for a user by email and password.
    const user = await this.findOne({ email })
    if (!user) {
      return Result.fail('invalid-login-credentials')
    }
    const doesPasswordMatch = await bcrypt.compare(password, user.password)
    if (!doesPasswordMatch) {
      return Result.fail('invalid-login-credentials')
    }
    return Result.ok(user)
  }

  public async updateUsername(
    this: DocumentType<User>,
    newUsername: string
  ): ReturnType<typeof validateUsername> {
    const usernameValidation = await validateUsername(newUsername)
    if (usernameValidation.isSuccess) {
      this.username = newUsername
      await this.save()
      return Result.ok()
    } else {
      return Result.fail(usernameValidation.error.name)
    }
  }

  public generateAccessToken(): string {
    const body = { _id: this.id, roles: this.roles ?? [] }
    return jwt.sign(body, AUTH_TOKEN_PRIVATE_KEY, {
      expiresIn: ACCESS_TOKEN_LIFESPAN,
    })
  }

  public async generateRefreshToken(): Promise<string> {
    // Get the PRE-hashed refresh token since this is the generation step where we need
    // to send it to the client
    const { preHashToken } = await RefreshToken.mongo.createNewTokenForUser(this.id)
    return preHashToken
  }

  // Get the URL we should redirect to when a card tap for this user comes in
  public async getCardTapLink(): Promise<string> {
    const contactInfoPageForUser = `/${this.username}`
    // If they don't have a website, the only option is the Nomus contact info page
    if (!this.website) {
      return contactInfoPageForUser
    }

    // So they do have a website, now we need to check if they (1) have Nomus Pro and (2) want to route to it.
    const nomusProSubscription = await NomusProSubscription.mongo.findOne({ user: this.id })
    return nomusProSubscription &&
      nomusProSubscription.isActive() &&
      nomusProSubscription.featureSet.UseCustomTapLink
      ? this.website
      : contactInfoPageForUser
  }

  public async getProfilePicUrl(this: DocumentType<User>): Promise<string | null> {
    if (this.profilePicUrl && this.profilePicUrl.length > 0) {
      return this.profilePicUrl
    } else if (this.profilePicS3Key) {
      const result = await S3.getSignedUrl(this.profilePicS3Key)
      return result.isSuccess ? result.value : null
    }
    return null
  }

  public async getProfilePicDataUrl(this: DocumentType<User>): Promise<string | null> {
    if (this.profilePicS3Key) {
      const result = await S3.getObject(this.profilePicS3Key)
      if (!result.isSuccess) {
        return null
      }
      return result.value.Body.toString('base64')
    }
    return null
  }

  public async verifyEmail(
    this: DocumentType<User>,
    token: string
  ): Promise<'already-verified' | 'success' | 'invalid' | 'expired'> {
    let result: 'already-verified' | 'success' | 'invalid' | 'expired' = 'success'
    if (this.isEmailVerified) result = 'already-verified'
    if (this.emailVerificationToken !== token) result = 'invalid'
    if (Date.now() > this.emailVerificationTokenExpiresAtMs) result = 'expired'

    if (result === 'success' || result === 'already-verified') {
      this.isEmailVerified = true
      await this.save()
    }
    return result
  }

  public async sendVerificationEmail(this: DocumentType<User>): Promise<void> {
    if (this.isEmailVerified) {
      throw new Error('User email is already verified, no need to send a verification email')
    }
    if (
      !this.emailVerificationToken ||
      // Check if the verification token expires in the next 10 minutes
      !this.emailVerificationTokenExpiresAtMs ||
      Date.now() + ms('10 minutes') >= this.emailVerificationTokenExpiresAtMs
    ) {
      // Create a new token and expiration time
      this.emailVerificationToken = crypto.randomBytes(20).toString('hex')
      this.emailVerificationTokenExpiresAtMs = Date.now() + EMAIL_VERIFICATION_TOKEN_LIFESPAN
      await this.save()
    }

    const verificationURLQueryParams = new URLSearchParams()
    verificationURLQueryParams.set('token', this.emailVerificationToken)
    verificationURLQueryParams.set('email', this.email)
    const verificationURL = `${BASE_URL}/auth/verify?${verificationURLQueryParams.toString()}`

    await sgMail.send({
      to: this.email,
      from: 'hi@nomus.me',
      templateId: SendgridTemplate.VerifyEmail,
      dynamicTemplateData: {
        verificationURL,
        firstName: this.name.first,
      },
    })
  }

  public async updateProfilePic(
    this: DocumentType<User>,
    file: FileUpload
  ): EventualResult<User, ''> {
    const filename = `${this.id}-${Date.now().toString()}-${file.filename}`
    const filepath = `/tmp/${filename}`

    const { createReadStream } = file

    try {
      const writableStream = fs.createWriteStream(filepath, {
        autoClose: true,
      })

      await new Promise((res, rej) => {
        createReadStream()
          .pipe(writableStream)
          .on('finish', () => res(true))
          .on('error', () => rej(false))
      })
    } catch (err) {
      throw new Error('Error creating write or readstream')
    }

    try {
      const result = await S3.uploadFileToS3(filepath, filename, S3.S3AssetCategory.ProfilePictures)
      if (!result.isSuccess) {
        throw new Error(`Failed to upload to S3: ${result.error}`)
      }

      this.profilePicS3Key = result.getValue()
      return Result.ok((await this.save()) as DocumentType<User>)
    } catch (err) {
      throw new Error(`unknown error: ${err}`)
    } finally {
      // Delete the file now that we're done
      fs.unlink(filepath, () => {})
    }
  }

  // Private methods
  private static defaultUsername(name: PersonName) {
    return [name.first, name.last, Math.random().toString(36).substring(2, 8)]
      .join('-')
      .toLowerCase()
  }
}

// Attach the mongoose model onto the core model itself
export const UserModel = getModelForClass(User)
User.mongo = UserModel

export default User
