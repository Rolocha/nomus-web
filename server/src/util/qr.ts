import AWS from 'aws-sdk'
import qrcode, { QRCodeToDataURLOptions } from 'qrcode'

import { s3BucketName } from 'src/config'
import { Result } from './error'

export const generateQR = async (url: string, options: QRCodeToDataURLOptions = {}) => {
  return await qrcode.toDataURL(url, {
    type: 'image/png',
    ...options,
  })
}

type URLToQRImageUrlError = 'failed-s3-upload' | 'failed-qr-generation' | 'failed-aws-connection'
export const urlToQRImageUrl = async (
  url: string,
  options: QRCodeToDataURLOptions,
  qrKey: string
): Promise<Result<string, URLToQRImageUrlError>> => {
  try {
    const qrCodeAsDataUrl = await generateQR(url, options).catch((err) => {
      throw new Error('failed-qr-generation')
    })

    let s3Service: AWS.S3 | null
    try {
      s3Service = new AWS.S3()
    } catch (err) {
      throw new Error('failed-aws-connection')
    }

    const buf = Buffer.from(qrCodeAsDataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const Key = s3BucketName + '/' + qrKey
    const params = {
      Bucket: s3BucketName,
      Key,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/png',
    }

    await s3Service
      .putObject(params)
      .promise()
      .catch((err) => {
        throw new Error('failed-s3-upload')
      })

    return Result.ok(`https://${s3BucketName}.s3.amazonaws.com/${Key}`)
  } catch (err) {
    return Result.fail(err.message)
  }
}
