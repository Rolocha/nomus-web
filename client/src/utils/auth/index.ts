import { AuthManager, BaseAuthData, BaseJWTBody } from './auth-manager'
import { AUTH_TOKEN_KEY } from 'config'

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
  middleName?: string
  lastName: string
  email: string
  password: string
}

export interface UseAuthOutput {
  loggedIn: boolean
  userRoles: Role[] | null
}

export interface JWTBody extends BaseJWTBody {
  _id: string
  roles: Role[]
}

const jsonFetch = async (
  method: string,
  route: string,
  body: object,
  token?: string,
) => {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(route, {
    method,
    body: JSON.stringify(body),
    headers,
  })
  return await res.json()
}

const authManager = new AuthManager<
  LoginArgs,
  SignupArgs,
  UseAuthOutput,
  BaseAuthData,
  JWTBody
>({
  expirationHeadstart: '10s',
  tokenStorageKey: AUTH_TOKEN_KEY,
  refreshToken: async ({ accessToken, refreshToken }): Promise<string> => {
    const response = await jsonFetch(
      'post',
      '/auth/refresh',
      { refreshToken },
      accessToken,
    )
    return response.accessToken
  },
  logIn: (args: LoginArgs) => jsonFetch('post', '/auth/login', args),
  signUp: (args: SignupArgs) => jsonFetch('post', '/auth/signup', args),
  makeUseAuthOutput: (authData, parsedToken) => {
    return {
      loggedIn: authData != null,
      userRoles: parsedToken ? parsedToken.roles : null,
    }
  },
})

export const useAuth = authManager.useAuth
export const getToken = authManager.getToken
