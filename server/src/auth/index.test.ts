import request from 'supertest'
import { app } from 'src/app'
import { createMockUser } from 'src/__mocks__/models/User'
import { cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { User } from 'src/models'
import * as authUtils from 'src/auth/util'
import { Result } from 'src/util/error'
import { sgMail } from 'src/util/sendgrid'
import { ACCESS_TOKEN_COOKIE_NAME } from 'src/config'

// NOTE: No need to initDB in this test bc the src/app import initializes it
afterAll(async () => {
  await cleanUpDB()
})

describe('GET /verify', () => {
  afterEach(async () => {
    await dropAllCollections()
  })
  it('verifies a user email and redirects to dashboard', async () => {
    const user = await createMockUser({
      email: 'foo@bar.com',
      isEmailVerified: false,
    })
    const verificationURLQueryParams = new URLSearchParams()
    verificationURLQueryParams.set('token', user.emailVerificationToken)
    verificationURLQueryParams.set('email', user.email)

    const verificationURL = `/auth/verify?${verificationURLQueryParams.toString()}`
    const result = await request(app).get(verificationURL)
    expect(result.redirect).toBe(true)
    expect(result.headers.location).toMatch(/\/dashboard/)
    expect(result.header.location).toMatch(/\?justVerifiedEmail/)
    const verifiedUser = await User.mongo.findOne({ email: user.email })
    expect(verifiedUser.isEmailVerified).toBe(true)
  })
})

describe('GET /resend-verification-email', () => {
  it('returns a 401 for an unauthenticated request', async () => {
    const result = await request(app).get(`/auth/resend-verification-email`)
    expect(result.unauthorized).toBe(true)
  })
  it('resends a verification email for a logged in request', async () => {
    const user = await createMockUser({
      email: 'ahhh@hi.com',
    })

    // Mock so the GET request looks like it's coming from the mock user
    jest.spyOn(authUtils, 'getUserFromToken').mockResolvedValue(Result.ok(user))
    jest.spyOn(sgMail, 'send').mockResolvedValue({} as any) // don't really care about response since we don't use it right now

    const result = await request(app)
      .get(`/auth/resend-verification-email`)
      // Cookie should be present but doesn't matter what it is
      .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=blahWhatever`])

    expect(result.ok).toBe(true)

    expect(sgMail.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: user.email,
        from: 'hi@nomus.me',
      })
    )
  })
})
