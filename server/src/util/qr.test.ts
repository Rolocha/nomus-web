import AWS from 'aws-sdk'
import * as AWSMock from 'aws-sdk-mock'
import { urlToQRImageUrl } from './qr'

describe('qr module', () => {
  describe('urlToImageUrl', () => {
    it('generates a QR code for the given url, uploads it to S3, and returns the link', async () => {
      AWSMock.setSDKInstance(AWS)
      const putObjectMock = jest.fn().mockImplementation((_, cb) => {
        cb()
      })
      AWSMock.mock('S3', 'putObject', putObjectMock)

      const TEST_URL = 'https://nomus.me'
      const TEST_QR_KEY = 'this-is-the-s3-reference'
      const result = await urlToQRImageUrl(TEST_URL, {}, TEST_QR_KEY)

      expect(result.isSuccess).toBe(true)
      expect(putObjectMock.mock.calls[0][0].Key).toContain(TEST_QR_KEY)

      // The internals of the URL may change, but verify it at least
      // looks like a URL and has the specified S3 object key
      expect(result.getValue()).toContain('https://')
      expect(result.getValue()).toContain(TEST_QR_KEY)
    })
  })
})
