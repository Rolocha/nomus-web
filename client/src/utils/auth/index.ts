import { AuthManager, BaseAuthData } from './auth-manager'
import { AUTH_DATA_KEY } from 'src/config'

// Needs to stay in sync with the enum at server/src/models/User.ts
export enum Role {
  User = 'user',
  Admin = 'admin',
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
  if (res.status === 200) {
    return await res.json()
  } else {
    throw new Error(`${method.toUpperCase()} ${route} failed`)
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
  refreshToken: (authData: AuthData) =>
    jsonFetch('post', '/auth/refresh', {
      id: authData.id,
    }),
  logIn: (args: LoginArgs) => jsonFetch('post', '/auth/login', args),
  signUp: (args: SignupArgs) => jsonFetch('post', '/auth/signup', args),
  makeUseAuthOutput: (authData) => {
    return {
      loggedIn: authData != null,
      userRoles: authData ? authData.roles : null,
    }
  },
})

export const useAuth = authManager.useAuth
export const ensureActiveToken = authManager.ensureActiveToken
