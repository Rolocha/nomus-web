import { AuthManager, BaseAuthData } from './auth-manager'
import { AUTH_DATA_KEY } from 'src/config'

// Needs to stay in sync with the enum at server/src/util/enums.ts
export enum Role {
  User = 'user',
  Admin = 'admin',
  PrintTech = 'print-tech',
}

export interface LoginArgs {
  email: string
  password: string
}

export interface SignupArgs {
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  password: string
}

export interface UseAuthOutput {
  loggedIn: boolean
  userRoles: Role[] | null
  id: string | null
}

export interface AuthData extends BaseAuthData {
  id: string
  roles: Role[]
}

const jsonFetch = async (method: string, route: string, body?: object) => {
  const options: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  if (body) {
    options.body = JSON.stringify(body)
  }
  const res = await fetch(route, options)
  const responseBody = await res.json()
  if (res.status !== 200) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${method.toUpperCase()} ${route} failed with status ${res.status}`,
      )
    }
  }
  return {
    status: res.status,
    body: responseBody,
  }
}

const authManager = new AuthManager<
  LoginArgs,
  SignupArgs,
  UseAuthOutput,
  AuthData
>({
  expirationHeadstart: '10s',
  authDataKey: AUTH_DATA_KEY,
  refreshToken: async (authData: AuthData) => {
    const res = await jsonFetch('post', '/auth/refresh', {
      id: authData.id,
    })
    return res.body
  },
  logIn: async (args: LoginArgs) => {
    const res = await jsonFetch('post', '/auth/login', args)
    return res.body
  },
  signUp: async (args: SignupArgs) => {
    const res = await jsonFetch('post', '/auth/signup', args)
    return res.body
  },
  logOut: async () => {
    try {
      const response = await fetch('/auth/logout', { method: 'post' })
      if (!response.ok || response.status !== 200) {
        throw new Error('Logout failed')
      }
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  makeUseAuthOutput: (authData): UseAuthOutput => {
    return {
      loggedIn: authData != null,
      userRoles: authData ? authData.roles : null,
      id: authData?.id ?? null,
    }
  },
})

export const useAuth = authManager.useAuth
export const ensureActiveToken = authManager.ensureActiveToken
export const logOutAndClearData = authManager.logOutAndClearData
export const resendVerificationEmail = async () => {
  const result = await fetch('/auth/resend-verification-email')
  return result.ok
}
