import AWS from 'aws-sdk'
import fs from 'fs'
import mime from 'mime-types'
import { EventualResult, Result } from 'src/util/error'
import { promisify } from 'util'

export enum S3AssetCategory {
  ProfilePictures = 'profile-pictures',
  BusinessCards = 'business-cards',
  QRCodes = 'qr-codes',
}

type UploadObjectFailureType =
  | 'failed-file-read'
  | 'failed-aws-connection'
  | 'failed-file-read'
  | 'failed-s3-upload'

// Clean up the S3 object key we use so it matches up with what the ultimate result AWS uses
const sanitizeKey = (key: string) => key.replace(' ', '+')

export const uploadProfilePicture = async (
  filepath: string,
  filename: string
): EventualResult<string, UploadObjectFailureType> => {
  try {
    const buffer = await promisify(fs.readFile)(filepath).catch(() => {
      throw new Error('failed-file-read')
    })

    let s3Service: AWS.S3 | null
    try {
      s3Service = new AWS.S3()
    } catch (err) {
      throw new Error('failed-aws-connection')
    }

    const ContentType = mime.lookup(filepath)
    if (ContentType === false) {
      throw new Error('failed-file-read')
    }

    const Key = sanitizeKey(`${S3AssetCategory.ProfilePictures}/${filename}`)
    const params = {
      Bucket: 'nomus-assets',
      Key,
      Body: buffer,
      ContentType,
    }

    await s3Service
      .putObject(params)
      .promise()
      .catch((err) => {
        console.error(err)
        throw new Error('failed-s3-upload')
      })

    return Result.ok(Key)
  } catch (err) {
    return Result.fail(err.message)
  }
}

export const getSignedUrl = async (
  key: string
): EventualResult<string, 'failed-aws-connection' | 'failed-get-object'> => {
  try {
    let s3Service: AWS.S3 | null
    try {
      s3Service = new AWS.S3()
    } catch (err) {
      throw new Error('failed-aws-connection')
    }

    const signedUrl = await s3Service
      .getSignedUrlPromise('getObject', {
        Bucket: 'nomus-assets',
        Key: key,
        // Get a signed url that lasts for 15 minutes
        Expires: 60 * 15,
      })
      .catch((err) => {
        throw new Error('failed-get-object')
      })
    return Result.ok(signedUrl)
  } catch (err) {
    return Result.fail(err.message)
  }
}

export const getBase64Url = async (
  key: string
): EventualResult<string, 'failed-aws-connection' | 'failed-get-object'> => {
  try {
    let s3Service: AWS.S3 | null
    try {
      s3Service = new AWS.S3()
    } catch (err) {
      throw new Error('failed-aws-connection')
    }

    const data = await s3Service
      .getObject({
        Bucket: 'nomus-assets',
        Key: key,
      })
      .promise()
      .catch((err) => {
        throw new Error('failed-get-object')
      })

    const base64Image = data.Body.toString('base64')
    return Result.ok(base64Image)
  } catch (err) {
    return Result.fail(err.message)
  }
}
