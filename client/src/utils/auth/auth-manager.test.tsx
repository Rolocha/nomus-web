import * as React from 'react'
import { render, act } from '@testing-library/react'

import {
  AuthManager,
  AuthManagerOptions,
  BaseAuthData,
  AuthResponse,
} from './auth-manager'
import { DateTime } from 'luxon'

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

interface AuthData extends BaseAuthData {
  roles: Role[]
}

const AUTH_DATA_KEY = 'AUTH_DATA'

const makeMockAuthResponse = ({
  tokenExp,
  roles,
}: Partial<AuthData> = {}): AuthResponse<AuthData> => ({
  data: {
    tokenExp: tokenExp ?? DateTime.now().plus({ minutes: 15 }).toSeconds(),
    roles: roles ?? [Role.User],
  },
})

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
  logOut,
  signUp,
  makeUseAuthOutput,
  expirationHeadstart,
}: Partial<
  AuthManagerOptions<LoginArgs, SignupArgs, UseAuthOutput, AuthData>
> = {}) => {
  const mockAuthResponse = makeMockAuthResponse()
  return new AuthManager<LoginArgs, SignupArgs, UseAuthOutput, AuthData>({
    expirationHeadstart: expirationHeadstart ?? '0',
    authDataKey: AUTH_DATA_KEY,
    refreshToken: refreshToken ?? jest.fn().mockResolvedValue(mockAuthResponse),
    logIn: logIn ?? jest.fn().mockResolvedValue(mockAuthResponse),
    logOut: logOut ?? jest.fn().mockResolvedValue(mockAuthResponse),
    signUp: signUp ?? jest.fn().mockResolvedValue(mockAuthResponse),
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
        makeUseAuthOutput: (authData) => ({
          userRoles: [Role.User],
        }),
      })
      const useAuthResultGetter = setup(am.useAuth) as () => ReturnType<
        typeof am.useAuth
      >

      const useAuthResult = useAuthResultGetter()
      expect(useAuthResult.userRoles).toContain(Role.User)
    })
  })

  describe('ensureActiveToken', () => {
    it('returns false when no auth data present locally', async () => {
      const am = makeTestManager({
        logIn: jest.fn(),
      })

      const activeTokenExists = await am.ensureActiveToken()
      expect(activeTokenExists).toBe(false)
    })

    it('returns true without invoking a refresh if auth data exists and is not about to expire', async () => {
      const mockAuthResponse = makeMockAuthResponse()
      localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(mockAuthResponse.data))

      const refreshToken = jest.fn()
      const am = makeTestManager({
        logIn: jest.fn(),
        refreshToken,
      })

      const activeTokenExists = await am.ensureActiveToken()
      expect(refreshToken).not.toHaveBeenCalled()
      expect(activeTokenExists).toBe(true)
    })

    it('returns true after invoking a refresh if auth data exists and is about to expire', async () => {
      // expires in 9 seconds (just below the 10s expiration headstart we use below)
      const mockAuthResponseThatExpiresSoon = makeMockAuthResponse({
        tokenExp: DateTime.now().plus({ seconds: 9 }).toSeconds(),
      })
      localStorage.setItem(
        AUTH_DATA_KEY,
        JSON.stringify(mockAuthResponseThatExpiresSoon.data),
      )

      const newAuthResponse = makeMockAuthResponse()
      const refreshToken = jest.fn().mockResolvedValue(newAuthResponse)
      const am = makeTestManager({
        logIn: jest.fn(),
        refreshToken,
        expirationHeadstart: '10s',
      })

      const activeTokenExists = await am.ensureActiveToken()
      expect(refreshToken).toHaveBeenCalled()
      expect(activeTokenExists).toBe(true)
    })

    it('returns false after invoking a refresh if auth data exists and is about to expire but refresh failed', async () => {
      // expires in 9 seconds (just below the 10s expiration headstart we use below)
      const mockAuthResponseThatExpiresSoon = makeMockAuthResponse({
        tokenExp: DateTime.now().plus({ seconds: 9 }).toSeconds(),
      })
      localStorage.setItem(
        AUTH_DATA_KEY,
        JSON.stringify(mockAuthResponseThatExpiresSoon.data),
      )

      const refreshToken = jest.fn().mockRejectedValue(new Error('failed!'))
      const am = makeTestManager({
        logIn: jest.fn(),
        refreshToken,
        expirationHeadstart: '10s',
      })

      const activeTokenExists = await am.ensureActiveToken()
      expect(refreshToken).toHaveBeenCalled()
      expect(activeTokenExists).toBe(false)
    })

    it('if refresh fails with invalid-refresh-token, logs the user out and redirects to /login', async () => {
      // expires in 9 seconds (just below the 10s expiration headstart we use below)
      const mockAuthResponseThatExpiresSoon = makeMockAuthResponse({
        tokenExp: DateTime.now().plus({ days: 10 }).toSeconds(),
      })
      localStorage.setItem(
        AUTH_DATA_KEY,
        JSON.stringify(mockAuthResponseThatExpiresSoon.data),
      )

      const refreshToken = jest.fn().mockResolvedValue({
        error: {
          code: 'invalid-refresh-token',
        },
      })
      const am = makeTestManager({
        logIn: jest.fn(),
        refreshToken,
        expirationHeadstart: '10s',
      })

      const logOutAndClearDataSpy = jest.spyOn(am, 'logOutAndClearData')
      // @ts-ignore
      delete window.location
      // @ts-ignore
      window.location = {
        replace: jest.fn(),
      }

      const activeTokenExists = await am.ensureActiveToken(true)

      expect(logOutAndClearDataSpy).toHaveBeenCalled()
      expect(window.location.replace).toHaveBeenCalledWith('/login')
      expect(refreshToken).toHaveBeenCalled()
      expect(activeTokenExists).toBe(false)
    })
  })
})
