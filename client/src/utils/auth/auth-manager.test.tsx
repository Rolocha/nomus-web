import * as React from 'react'
import { render, act } from '@testing-library/react'
import jwt from 'jsonwebtoken'

import {
  AuthManager,
  AuthManagerOptions,
  BaseAuthData,
  BaseJWTBody,
} from './auth-manager'

enum Role {
  User = 'user',
  Admin = 'admin',
}

interface LoginArgs {
  email: string
  password: string
}

interface SignupArgs {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  password: string
}

interface UseAuthOutput {
  userRoles: Role[] | null
}

interface JWTBody extends BaseJWTBody {
  _id: string
  roles: Role[]
}

const JWT_SECRET_KEY = 'whatever'
const makeMockAuthData = (exp?: string) => ({
  accessToken: jwt.sign(
    {
      _id: 'fakeId',
      roles: ['user'],
    },
    JWT_SECRET_KEY,
    { expiresIn: exp ?? '15m' },
  ),
  refreshToken: 'fakeRefreshToken',
})

const TOKEN_STORAGE_KEY = 'authData'

const setup = (useAuth: () => any) => {
  const returnVal = {}
  function TestComponent() {
    Object.assign(returnVal, useAuth())
    return null
  }
  render(<TestComponent />)
  return () => returnVal
}

const makeTestManager = ({
  refreshToken,
  logIn,
  signUp,
  makeUseAuthOutput,
  expirationHeadstart,
}: Partial<
  AuthManagerOptions<
    LoginArgs,
    SignupArgs,
    UseAuthOutput,
    BaseAuthData,
    JWTBody
  >
> = {}) => {
  const mockAuthData = makeMockAuthData()
  return new AuthManager<
    LoginArgs,
    SignupArgs,
    UseAuthOutput,
    BaseAuthData,
    JWTBody
  >({
    expirationHeadstart: expirationHeadstart ?? '0',
    tokenStorageKey: TOKEN_STORAGE_KEY,
    refreshToken: refreshToken ?? jest.fn().mockResolvedValue(''),
    logIn: logIn ?? jest.fn().mockResolvedValue(mockAuthData),
    signUp: signUp ?? jest.fn().mockResolvedValue(mockAuthData),
    makeUseAuthOutput: makeUseAuthOutput ?? jest.fn().mockReturnValue({}),
  })
}

describe('AuthManager', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('useAuth', () => {
    it('a successful logIn results in loggedIn being true', async () => {
      const am = makeTestManager()
      const useAuthResultGetter = setup(am.useAuth) as () => ReturnType<
        typeof am.useAuth
      >

      const useAuthResult = useAuthResultGetter()

      expect(useAuthResult.loggedIn).toBe(false)
      await act(async () => {
        await useAuthResult.logIn({ email: 'email', password: 'password' })
      })

      const useAuthResultAfterLogIn = useAuthResultGetter()
      expect(useAuthResultAfterLogIn.loggedIn).toBe(true)
    })

    it('a successful signUp results in loggedIn being true', async () => {
      const am = makeTestManager()
      const useAuthResultGetter = setup(am.useAuth) as () => ReturnType<
        typeof am.useAuth
      >

      const useAuthResult = useAuthResultGetter()

      expect(useAuthResult.loggedIn).toBe(false)
      await act(async () => {
        await useAuthResult.signUp({
          firstName: 'first',
          lastName: 'last',
          email: 'email',
          password: 'password',
        })
      })

      const useAuthResultAfterLogIn = useAuthResultGetter()
      expect(useAuthResultAfterLogIn.loggedIn).toBe(true)
    })

    it('a failed logIn results in loggedIn staying false', async () => {
      const am = makeTestManager({
        logIn: jest.fn().mockRejectedValue(new Error()),
      })
      const useAuthResultGetter = setup(am.useAuth) as () => ReturnType<
        typeof am.useAuth
      >

      const useAuthResult = useAuthResultGetter()

      expect(useAuthResult.loggedIn).toBe(false)
      await act(async () => {
        try {
          await useAuthResult.logIn({ email: 'email', password: 'password' })
        } catch (err) {
          // ignore error, in practice, the login UI should handle it
        }
      })

      const useAuthResultAfterLogIn = useAuthResultGetter()
      expect(useAuthResultAfterLogIn.loggedIn).toBe(false)
    })

    it('a failed signUp results in loggedIn staying false', async () => {
      const am = makeTestManager({
        signUp: jest.fn().mockRejectedValue(new Error()),
      })
      const useAuthResultGetter = setup(am.useAuth) as () => ReturnType<
        typeof am.useAuth
      >

      const useAuthResult = useAuthResultGetter()

      expect(useAuthResult.loggedIn).toBe(false)
      await act(async () => {
        try {
          await useAuthResult.signUp({
            firstName: 'first',
            lastName: 'last',
            email: 'email',
            password: 'password',
          })
        } catch (err) {
          // ignore error, in practice, the login UI should handle it
        }
      })

      const useAuthResultAfterLogIn = useAuthResultGetter()
      expect(useAuthResultAfterLogIn.loggedIn).toBe(false)
    })

    it('passes the data you specify in makeUseAuthOutput through useAuth', () => {
      const am = makeTestManager({
        makeUseAuthOutput: (authData, parsedJWT) => ({
          userRoles: [Role.User],
        }),
      })
      const useAuthResultGetter = setup(am.useAuth) as () => ReturnType<
        typeof am.useAuth
      >

      const useAuthResult = useAuthResultGetter()
      expect(useAuthResult.userRoles).toContain('user')
    })
  })

  describe('getToken', () => {
    it('returns null when no token present locally', async () => {
      const am = makeTestManager({
        logIn: jest.fn(),
      })

      const token = await am.getToken()
      expect(token).toBeNull()
    })

    it("returns the token without doing a refresh when it exists and isn't about to expire", async () => {
      const mockAuthData = makeMockAuthData()
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(mockAuthData))

      const am = makeTestManager({
        logIn: jest.fn(),
      })

      const token = await am.getToken()
      expect(am['refreshToken']).not.toHaveBeenCalled()
      expect(token).toBe(mockAuthData.accessToken)
    })

    it('returns the token after doing a refresh when it exists but is about to expire', async () => {
      // expires in 9 seconds (just below the 10s expiration headstart we use below)
      const mockAuthDataThatExpiresSoon = makeMockAuthData('9s')
      localStorage.setItem(
        TOKEN_STORAGE_KEY,
        JSON.stringify(mockAuthDataThatExpiresSoon),
      )

      const refreshToken = jest.fn().mockResolvedValue('newAccessToken')
      const am = makeTestManager({
        logIn: jest.fn(),
        refreshToken,
        expirationHeadstart: '10s',
      })

      const token = await am.getToken()
      expect(refreshToken).toHaveBeenCalled()
      expect(token).toBe('newAccessToken')
    })
  })
})
