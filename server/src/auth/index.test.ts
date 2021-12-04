import request from 'supertest'
import { app } from 'src/app'
import { createMockUser } from 'src/__mocks__/models/User'
import { cleanUpDB, dropAllCollections } from 'src/test-utils/db'
import { User } from 'src/models'
import * as authUtils from 'src/auth/util'
import { Result } from 'src/util/error'
import { sgMail } from 'src/util/sendgrid'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from 'src/config'
import { createMockRefreshToken } from 'src/__mocks__/models/RefreshToken'
import axios from 'axios'

// NOTE: No need to initDB in this test bc the src/app import initializes it
afterAll(async () => {
  await cleanUpDB()
})

afterEach(async () => {
  await dropAllCollections()
})

describe('POST /login', () => {
  const loginPayload = {
    email: 'someone@email.com',
    password: 'some-password',
  }
  beforeEach(() => {
    jest.spyOn(sgMail, 'send').mockResolvedValue({} as any) // don't really care about response since we don't use it right now
  })

  it('responds with a 401 if no user with that email exists', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'no-user-with-this@email.com',
      password: 'doesnt matter',
    })
    expect(response.status).toBe(401)
  })

  it('responds with a 401 if the wrong password is provided', async () => {
    await createMockUser(loginPayload)
    const response = await request(app).post('/auth/login').send({
      email: loginPayload.email,
      password: 'wrong password',
    })
    expect(response.status).toBe(401)
  })

  it('sets the access token and refresh token cookies', async () => {
    await createMockUser(loginPayload)

    const response = await request(app).post('/auth/login').send(loginPayload)
    expect(response.ok).toBe(true)

    expect(response.header['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/X-Access-Token=.*/),
        expect.stringMatching(/X-Refresh-Token=.*/),
      ])
    )
  })
})

describe('POST /logout', () => {
  it('clears the access token and refresh token cookies', async () => {
    const response = await request(app).post('/auth/logout')
    expect(response.status).toBe(200)

    expect(response.header['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/X-Access-Token=[^;]*/),
        expect.stringMatching(/X-Refresh-Token=[^;]*/),
      ])
    )
  })

  it("invalidates the user's refresh token", async () => {
    const user = await createMockUser({})
    const { preHashToken } = await createMockRefreshToken(user.id)

    const response = await request(app)
      .post('/auth/logout')
      .set('Cookie', [
        `${ACCESS_TOKEN_COOKIE_NAME}=blahWhatever;${REFRESH_TOKEN_COOKIE_NAME}=${preHashToken}`,
      ])
    expect(response.status).toBe(200)

    expect(response.header['set-cookie']).toEqual(
      expect.arrayContaining([
        // expect cookies being set to empty string
        expect.stringMatching(/X-Access-Token=;/),
        expect.stringMatching(/X-Refresh-Token=;/),
      ])
    )
  })
})

describe('POST /signup', () => {
  const signupPayload = {
    firstName: 'Someone',
    lastName: 'Personman',
    email: 'someone@personman.com',
    password: 'an-actually-secure-password',
  }

  beforeEach(() => {
    jest.spyOn(sgMail, 'send').mockResolvedValue({} as any) // don't really care about response since we don't use it right now
    jest.spyOn(axios, 'post').mockResolvedValue({} as any)
  })

  it('creates a new user with the provided registration info', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=blahWhatever`])
      .send(signupPayload)
    expect(response.ok).toBe(true)

    const user = await User.mongo.findOne({ email: signupPayload.email })
    expect(user).toMatchObject({
      name: {
        first: signupPayload.firstName,
        last: signupPayload.lastName,
      },
      email: signupPayload.email,
      password: expect.stringMatching(/.*/),
    })
  })

  it('sets the access token and refresh token cookies', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=blahWhatever`])
      .send(signupPayload)
    expect(response.ok).toBe(true)

    expect(response.header['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/X-Access-Token=.*/),
        expect.stringMatching(/X-Refresh-Token=.*/),
      ])
    )
  })

  it('sends a verification email', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=blahWhatever`])
      .send(signupPayload)
    expect(response.ok).toBe(true)

    expect(sgMail.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'someone@personman.com',
      })
    )
  })

  it('fails if the password is too weak', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=blahWhatever`])
      .send({ ...signupPayload, password: 'nomus' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          code: 'password-too-weak',
        },
      })
    )
  })

  it('fails on a non-unique email', async () => {
    await createMockUser({ email: 'someone@personman.com' })

    const response = await request(app)
      .post('/auth/signup')
      .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=blahWhatever`])
      .send(signupPayload)

    expect(response.status).toBe(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          code: 'non-unique-email',
        },
      })
    )
  })
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
