import * as React from 'react'
import { render, act } from '@testing-library/react'

import { AuthManager, AuthManagerOptions, BaseAuthData } from './auth-manager'

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

const makeExpTimeInSeconds = (secondsFromNow: number) =>
  (Date.now() + secondsFromNow * 1000) / 1000

const makeMockAuthData = ({
  tokenExp,
  roles,
}: Partial<AuthData> = {}): AuthData => ({
  tokenExp: tokenExp ?? makeExpTimeInSeconds(15 * 60), // in 15 minutes
  roles: roles ?? [Role.User],
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
  signUp,
  makeUseAuthOutput,
  expirationHeadstart,
}: Partial<
  AuthManagerOptions<LoginArgs, SignupArgs, UseAuthOutput, AuthData>
> = {}) => {
  const mockAuthData = makeMockAuthData()
  return new AuthManager<LoginArgs, SignupArgs, UseAuthOutput, AuthData>({
    expirationHeadstart: expirationHeadstart ?? '0',
    authDataKey: AUTH_DATA_KEY,
    refreshToken: refreshToken ?? jest.fn().mockResolvedValue(mockAuthData),
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

  describe('getAuthData', () => {
    it('returns null when no auth data present locally', async () => {
      const am = makeTestManager({
        logIn: jest.fn(),
      })

      const token = await am.getAuthData()
      expect(token).toBeNull()
    })

    it("returns the data without doing a refresh when it exists and isn't about to expire", async () => {
      const mockAuthData = makeMockAuthData()
      localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(mockAuthData))

      const refreshToken = jest.fn()
      const am = makeTestManager({
        logIn: jest.fn(),
        refreshToken,
      })

      const authData = await am.getAuthData()
      expect(refreshToken).not.toHaveBeenCalled()
      expect(authData).toMatchObject(mockAuthData)
    })

    it('returns the data after doing a refresh when it exists but is about to expire', async () => {
      // expires in 9 seconds (just below the 10s expiration headstart we use below)
      const mockAuthDataThatExpiresSoon = makeMockAuthData({
        tokenExp: makeExpTimeInSeconds(9),
      })
      localStorage.setItem(
        AUTH_DATA_KEY,
        JSON.stringify(mockAuthDataThatExpiresSoon),
      )

      const newAuthData = makeMockAuthData()
      const refreshToken = jest.fn().mockResolvedValue(newAuthData)
      const am = makeTestManager({
        logIn: jest.fn(),
        refreshToken,
        expirationHeadstart: '10s',
      })

      const authData = await am.getAuthData()
      expect(refreshToken).toHaveBeenCalled()
      expect(authData).toMatchObject(newAuthData)
    })
  })
})
