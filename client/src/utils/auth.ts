import { useEffect, useState } from 'react'
import { AUTH_TOKEN_KEY } from 'config'

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export interface JWTBody {
  _id: string
  exp: number
  roles: Role[]
}

export interface AuthData {
  accessToken: string
  refreshToken: string
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

type NullableAuthData = AuthData | null

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

const parseJWT = (jwt: string) => {
  if (!(typeof jwt === 'string')) {
    return null
  }

  const split = jwt.split('.')

  if (split.length < 2) {
    return null
  }

  try {
    const jwtBody = JSON.parse(atob(jwt.split('.')[1])) as JWTBody
    return jwtBody
  } catch (e) {
    return null
  }
}

const createAuthManager = () => {
  const getAuthDataFromLocal = (): NullableAuthData => {
    const authDataRaw = localStorage.getItem(AUTH_TOKEN_KEY)
    return authDataRaw != null ? JSON.parse(authDataRaw) : null
  }

  let listeners: Array<(newData: NullableAuthData) => void> = []

  const subscribe = (listener: (authData: NullableAuthData) => void) => {
    listeners.push(listener)
  }

  const unsubscribe = (listener: (authData: NullableAuthData) => void) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  const isExpired = (token: JWTBody) => {
    // Date.now() uses ms, token.exp uses s
    return Date.now() > token.exp * 1000
  }

  const fetchRefresh = ({
    accessToken,
    refreshToken,
  }: AuthData): Promise<{ accessToken: string }> =>
    jsonFetch('post', '/auth/refresh', { refreshToken }, accessToken)

  const refreshTokenIfNeeded = async () => {
    const localAuthData = getAuthDataFromLocal()
    if (localAuthData) {
      const maybeExpiredAccessToken = parseJWT(localAuthData.accessToken)
      if (maybeExpiredAccessToken && isExpired(maybeExpiredAccessToken)) {
        const { accessToken } = await fetchRefresh(localAuthData)
        updateAuthData({
          ...localAuthData,
          accessToken,
        })
      }
    }
  }

  // Token is subtly different from authData, latter is parsed and JWT signature removed
  const getToken = async () => {
    await refreshTokenIfNeeded()
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }

  const notifyListeners = (authData: NullableAuthData) => {
    listeners.forEach((l) => l(authData))
  }

  const updateAuthData = (data: NullableAuthData) => {
    // Update localStorage with new auth data
    if (data) {
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(data))
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }

    // Notify subscribed listeners
    notifyListeners(data)
  }

  const _logIn = async (args: LoginArgs) => {
    const resp = (await jsonFetch('post', '/auth/login', args)) as AuthData
    updateAuthData(resp)
  }

  const _signUp = async (args: SignupArgs) => {
    const resp = (await jsonFetch('post', '/auth/signup', args)) as AuthData
    updateAuthData(resp)
  }

  const useAuth = () => {
    const [authData, setAuthData] = useState<NullableAuthData>(
      getAuthDataFromLocal(),
    )

    // Configure a React effect that will update the hook consumer with new authData
    // whenever it becomes available
    useEffect(() => {
      const listener = (newAuthData: NullableAuthData) => {
        setAuthData(newAuthData)
      }
      subscribe(listener)
      return () => {
        unsubscribe(listener)
      }
    })

    const parsedJWT = authData ? parseJWT(authData.accessToken) : null
    return {
      loggedIn: authData != null,
      userRoles: parsedJWT ? parsedJWT.roles : null,
      logIn: _logIn,
      signUp: _signUp,
    }
  }

  return { useAuth, getToken }
}

export const { useAuth, getToken } = createAuthManager()
