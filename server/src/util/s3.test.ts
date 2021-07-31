import AWS from 'aws-sdk'
import * as AWSMock from 'aws-sdk-mock'
import fs from 'fs'
import { Result } from 'src/util/error'
import { promisify } from 'util'
import * as S3 from './s3'

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

        const result = await S3.uploadFileToS3(
          'test.png',
          'test',
          S3.S3AssetCategory.ProfilePictures
        )
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

  describe('uploadGraphQLFileToS3', () => {
    it('writes the file to the /tmp directory, then passes in the filename to uploadFileToS3', async () => {
      // For the sake of this test, we have to have the data be in a file on disk first
      // so we can create a readstream for it
      const filepath = '/tmp/test.txt'
      fs.writeFileSync(filepath, 'Hey there!')
      const file = {
        filename: 'test.txt',
        mimetype: 'text/plain',
        encoding: 'utf-8',
        createReadStream: () => fs.createReadStream(filepath),
      }

      const uploadFileToS3Spy = jest
        .spyOn(S3, 'uploadFileToS3')
        .mockResolvedValue(Result.ok('s3-key'))

      const result = await S3.uploadGraphQLFileToS3(
        file,
        file.filename,
        S3.S3AssetCategory.CardVersions
      )

      expect(result.value).toEqual('s3-key')
      expect(uploadFileToS3Spy).toHaveBeenCalledWith(
        expect.stringMatching(/^\/tmp\/nomus-s3-upload\/.*\/test.txt$/),
        'test.txt',
        S3.S3AssetCategory.CardVersions
      )
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      } else {
        console.warn("test.txt was supposed to get removed but it didn't exist!")
      }
    })
  })

  describe('getSignedUrl', () => {
    it('calls S3.getSignedUrl with the provided key and returns its result', async () => {
      const key = 'my-key'
      const signedUrl = 'https://here-it-is.com'
      AWSMock.setSDKInstance(AWS)
      const getSignedUrl = jest.fn().mockImplementation((action, options, callback) => {
        callback(null, signedUrl)
      })
      AWSMock.mock('S3', 'getSignedUrl', getSignedUrl)

      const result = await S3.getSignedUrl(key)

      expect(getSignedUrl.mock.calls[0][0]).toBe('getObject')
      expect(getSignedUrl.mock.calls[0][1].Key).toBe(key)
      expect(getSignedUrl.mock.calls[0][1].Bucket).toBe('nomus-assets')

      expect(result.value).toBe(signedUrl)
    })
  })
})
