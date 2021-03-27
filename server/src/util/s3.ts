import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import { FileUpload } from 'graphql-upload'
import mime from 'mime-types'
import { EventualResult, Result } from 'src/util/error'
import { promisify } from 'util'

export enum S3AssetCategory {
  ProfilePictures = 'profile-pictures',
  CardVersions = 'card-versions',
  QRCodes = 'qr-codes',
  EncodingCSV = 'encoding-csv',
}

type UploadObjectFailureType =
  | 'failed-file-read'
  | 'failed-aws-connection'
  | 'failed-file-read'
  | 'failed-s3-upload'

// Clean up the S3 object key we use so it matches up with what the ultimate result AWS uses
const sanitizeKey = (key: string) => key.replace(' ', '+')

export const uploadFileToS3 = async (
  filepath: string,
  filename: string,
  s3Asset: S3AssetCategory
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

    const Key = sanitizeKey(`${s3Asset}/${filename}`)
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

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}

export const uploadGraphQLFileToS3 = async (
  file: FileUpload,
  filename: string,
  assetCategory: S3AssetCategory
): Promise<Result<string, 'invalid-mime-type'>> => {
  const tmpDirForThisRequest = path.join('/tmp', 'nomus-s3-upload', String(Date.now()))
  const fileExtension = mime.extension(file.mimetype)
  if (!fileExtension) {
    return Result.fail('invalid-mime-type')
  }
  const filepath = path.join(
    tmpDirForThisRequest,
    // Add file extension if not already present
    filename.endsWith(`.${fileExtension}`) ? filename : `${filename}.${fileExtension}`
  )
  ensureDirectoryExistence(filepath)

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
    console.log(err)
    throw new Error('Error creating write or readstream')
  }

  try {
    const result = await uploadFileToS3(filepath, filename, assetCategory)
    if (!result.isSuccess) {
      throw new Error(`Failed to upload to S3: ${result.error}`)
    }

    return Result.ok(result.getValue())
  } catch (err) {
    throw new Error(`unknown error: ${err}`)
  } finally {
    // and delete the temporary folder we made in tmp
    fs.rmdir(tmpDirForThisRequest, { recursive: true }, () => {})
  }
}

export const getObjectUrl = (key: string) => {
  return `https://nomus-assets.s3.amazonaws.com/${key}`
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
