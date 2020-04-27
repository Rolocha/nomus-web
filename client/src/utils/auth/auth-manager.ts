// Heavily inspired by https://github.com/obabichev/react-token-auth

import { useEffect, useState } from 'react'
import ms from 'ms'

export interface BaseJWTBody {
  exp?: number
}

export interface BaseAuthData {
  accessToken: string
  refreshToken: string
}

interface AuthManagerOptions<
  LoginArgs,
  SignupArgs,
  UseAuthOutput,
  AuthData extends BaseAuthData = BaseAuthData,
  AccessTokenBody extends BaseJWTBody = BaseJWTBody
> {
  // Specifies in zeit/ms (https://www.npmjs.com/package/ms) time how much earlier than true expiration time
  // to deem an access token expired. This value can be useful in preventing the infrequent but non-neglible
  // possibility of the token expiring between client sending the request and server processing it
  expirationHeadstart: string
  // The key in localStorage under which to store the auth data
  tokenStorageKey: string
  // An async function that hits your login endpoint and responds with auth data
  logIn: (args: LoginArgs) => Promise<AuthData>
  // An async function that hits your signup endpoint and responds with auth data
  signUp: (args: SignupArgs) => Promise<AuthData>
  // An async function that hits your refresh endpoint and responds with a new access token
  refreshToken: (authData: AuthData) => Promise<string>
  // A function for converting your auth data into the object you want useAuth to return
  // The auth manager will also include your logIn, signUp, and refreshToken methods in
  // the useAuth output, in addition to what you specify in this function
  makeUseAuthOutput: (
    authData: AuthData | null,
    parsedToken: AccessTokenBody | null,
  ) => UseAuthOutput
}

export class AuthManager<
  LoginArgs,
  SignupArgs,
  UseAuthOutput,
  AuthData extends BaseAuthData = BaseAuthData,
  AccessTokenBody extends BaseJWTBody = BaseJWTBody
> {
  // Consumer supplied configuration via constructor
  private logIn: (args: LoginArgs) => Promise<AuthData>
  private signUp: (args: SignupArgs) => Promise<AuthData>
  private refreshToken: (args: AuthData) => Promise<string>
  private makeUseAuthOutput: (
    authData: AuthData | null,
    parsedToken: AccessTokenBody | null,
  ) => UseAuthOutput
  private tokenStorageKey: string
  private expirationHeadstart: number

  private listeners: Array<(newData: AuthData | null) => void> = []
  private get authData(): AuthData | null {
    const authDataRaw = localStorage.getItem(this.tokenStorageKey)
    return authDataRaw != null ? JSON.parse(authDataRaw) : null
  }

  constructor({
    tokenStorageKey,
    logIn,
    signUp,
    refreshToken,
    makeUseAuthOutput,
    expirationHeadstart,
  }: AuthManagerOptions<
    LoginArgs,
    SignupArgs,
    UseAuthOutput,
    AuthData,
    AccessTokenBody
  >) {
    this.logIn = logIn
    this.signUp = signUp
    this.refreshToken = refreshToken
    this.tokenStorageKey = tokenStorageKey
    this.makeUseAuthOutput = makeUseAuthOutput
    this.expirationHeadstart = expirationHeadstart ? ms(expirationHeadstart) : 0
  }

  public getToken = async () => {
    await this.refreshTokenIfNeeded()
    return localStorage.getItem(this.tokenStorageKey)
  }

  public useAuth = () => {
    const [authData, setAuthData] = useState<AuthData | null>(this.authData)

    // Configure a React effect that will update the hook consumer with new authData
    // whenever it becomes available
    useEffect(() => {
      const listener = (newAuthData: AuthData | null) => {
        setAuthData(newAuthData)
      }
      this.subscribe(listener)
      return () => {
        this.unsubscribe(listener)
      }
    })

    return {
      ...this.makeUseAuthOutput(
        authData,
        authData ? this.parseJWT(authData.accessToken) : null,
      ),
      logIn: this.logIn,
      signUp: this.signUp,
      refreshToken: this.refreshToken,
    }
  }

  public parseJWT(jwt: string): AccessTokenBody | null {
    if (!(typeof jwt === 'string')) {
      return null
    }

    const split = jwt.split('.')

    if (split.length < 2) {
      return null
    }

    try {
      return JSON.parse(atob(jwt.split('.')[1]))
    } catch (e) {
      return null
    }
  }

  // Private methods

  private subscribe(listener: (authData: AuthData | null) => void) {
    this.listeners.push(listener)
  }

  private unsubscribe(listener: (authData: AuthData | null) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  private notifyListeners(authData: AuthData | null) {
    this.listeners.forEach((l) => l(authData))
  }

  private isExpired(token: AccessTokenBody) {
    // Date.now() uses ms, token.exp uses s
    return token.exp && Date.now() > token.exp * 1000 - this.expirationHeadstart
  }

  private async refreshTokenIfNeeded() {
    const authData = this.authData
    if (authData) {
      const maybeExpiredAccessToken = this.parseJWT(authData.accessToken)
      if (maybeExpiredAccessToken && this.isExpired(maybeExpiredAccessToken)) {
        const accessToken = await this.refreshToken(authData)
        this.updateAuthData({
          ...authData,
          accessToken,
        })
      }
    }
  }

  private async updateAuthData(authData: AuthData | null) {
    // Update localStorage with new auth data
    if (authData) {
      localStorage.setItem(this.tokenStorageKey, JSON.stringify(authData))
    } else {
      localStorage.removeItem(this.tokenStorageKey)
    }

    // Notify subscribed listeners
    this.notifyListeners(authData)
  }
}
