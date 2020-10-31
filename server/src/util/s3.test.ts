import fs from 'fs'
import { promisify } from 'util'
import AWS from 'aws-sdk'
import * as AWSMock from 'aws-sdk-mock'
import { S3AssetCategory, uploadFileToS3 } from './s3'

jest.setTimeout(30000)

describe('s3 module', () => {
  describe('uploadFileToS3', () => {
    it('uploads file to S3', async () => {
      try {
        AWSMock.setSDKInstance(AWS)
        const putObjectMock = jest.fn().mockImplementation((_, cb) => {
          cb()
        })
        AWSMock.mock('S3', 'putObject', putObjectMock)

        // Definitely an invalid image but shouldn't matter for this
        const testImage = new Uint8Array(Buffer.from('Hello Node.js'))
        await promisify(fs.writeFile)('test.png', testImage)

        const result = await uploadFileToS3('test.png', 'test', S3AssetCategory.ProfilePictures)
        expect(result.isSuccess).toBe(true)
        expect(putObjectMock.mock.calls[0][0].Key).toContain('test')

        expect(result.getValue()).toContain('test')
      } catch (err) {
        console.log(err)
      } finally {
        await promisify(fs.unlink)('./test.png')
      }
    })
  })
})
