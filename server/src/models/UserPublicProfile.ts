import {
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
  DocumentType,
} from '@typegoose/typegoose'
import { Field } from 'type-graphql'
import { BaseModel } from './BaseModel'
import { CardVersion } from './CardVersion'
import { Ref } from './scalars'
import { User } from './User'
import * as S3 from 'src/util/s3'
import { FileUpload } from 'graphql-upload'
import { EventualResult, Result } from 'src/util/error'
import * as fs from 'fs'

// @ts-ignore
@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true, _id: String } })
export class UserPublicProfile extends BaseModel({
  prefix: 'pubprof',
}) {
  static mongo: ReturnModelType<typeof UserPublicProfile>
  // A reference to the User object this profile belongs to
  @prop({ required: true, ref: () => User, type: String })
  user: Ref<User>

  @prop()
  @Field({ nullable: true })
  headline: string

  @prop()
  @Field({ nullable: true })
  bio: string

  @Field({ nullable: true, description: "A URL pointing to the user's profile picture" })
  profilePicUrl: string

  // The S3 key pointing to the user's profile pic, requires fetching server-side and attaching
  // on profilePicUrl when sending to a client
  @prop()
  profilePicS3Key: string

  @prop({ match: /^\d{10,11}$/ })
  @Field({ nullable: true })
  phoneNumber: string

  @prop({ required: false, ref: () => CardVersion, type: String })
  defaultCardVersion: Ref<CardVersion>

  @prop({ required: false })
  @Field()
  vcfUrl: string

  public async getProfilePicUrl(this: DocumentType<UserPublicProfile>): Promise<string | null> {
    if (this.profilePicUrl && this.profilePicUrl.length > 0) {
      return this.profilePicUrl
    } else if (this.profilePicS3Key) {
      const result = await S3.getSignedUrl(this.profilePicS3Key)
      return result.isSuccess ? result.value : null
    }
    return null
  }

  public async getProfilePicDataUrl(this: DocumentType<UserPublicProfile>): Promise<string | null> {
    if (this.profilePicS3Key) {
      const result = await S3.getBase64Url(this.profilePicS3Key)
      return result.isSuccess ? result.value : null
    }
    return null
  }

  public async updateProfilePic(
    this: DocumentType<UserPublicProfile>,
    file: FileUpload
  ): EventualResult<UserPublicProfile, ''> {
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
      return Result.ok((await this.save()) as DocumentType<UserPublicProfile>)
    } catch (err) {
      throw new Error(`unknown error: ${err}`)
    } finally {
      // Delete the file now that we're done
      fs.unlink(filepath, () => {})
    }
  }
}

// Attach the mongoose model onto the core model itself
export const UserProfileModel = getModelForClass(UserPublicProfile)
UserPublicProfile.mongo = UserProfileModel

export default UserPublicProfile
