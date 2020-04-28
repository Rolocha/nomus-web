// Heavily inspired by https://github.com/obabichev/react-token-auth

import { useEffect, useState } from 'react'
import ms from 'ms'

export interface BaseAuthData {
  tokenExp: number
}

export interface AuthManagerOptions<
  LoginArgs,
  SignupArgs,
  UseAuthOutput,
  AuthData extends BaseAuthData = BaseAuthData
> {
  // Specifies in zeit/ms (https://www.npmjs.com/package/ms) time how much earlier than true expiration time
  // to deem an access token expired. This value can be useful in preventing the infrequent but non-neglible
  // possibility of the token expiring between client sending the request and server processing it
  expirationHeadstart: string
  // The key in localStorage under which to store the auth data
  authDataKey: string
  // An async function that hits your login endpoint and responds with auth data
  logIn: (args: LoginArgs) => Promise<AuthData>
  // An async function that hits your signup endpoint and responds with auth data
  signUp: (args: SignupArgs) => Promise<AuthData>
  // An async function that hits your refresh endpoint and responds with a new access token
  refreshToken: (authData: AuthData) => Promise<AuthData>
  // A function for converting your auth data into the object you want useAuth to return
  // The auth manager will also include your logIn, signUp, and refreshToken methods in
  // the useAuth output, in addition to what you specify in this function
  makeUseAuthOutput: (authData: AuthData | null) => UseAuthOutput
}

export class AuthManager<
  LoginArgs,
  SignupArgs,
  UseAuthOutput,
  AuthData extends BaseAuthData = BaseAuthData
> {
  // Consumer supplied configuration via constructor
  private logIn: (args: LoginArgs) => Promise<AuthData>
  private signUp: (args: SignupArgs) => Promise<AuthData>
  private refreshToken: (args: AuthData) => Promise<AuthData>
  private makeUseAuthOutput: (authData: AuthData | null) => UseAuthOutput
  private authDataKey: string
  private expirationHeadstart: number
  private refreshRequestInFlight: boolean = false

  private listeners: Array<(newData: AuthData | null) => void> = []
  private get authData(): AuthData | null {
    const authDataRaw = localStorage.getItem(this.authDataKey)
    return authDataRaw != null ? JSON.parse(authDataRaw) : null
  }

  constructor({
    authDataKey,
    logIn,
    signUp,
    refreshToken,
    makeUseAuthOutput,
    expirationHeadstart,
  }: AuthManagerOptions<LoginArgs, SignupArgs, UseAuthOutput, AuthData>) {
    this.logIn = logIn
    this.signUp = signUp
    this.refreshToken = refreshToken
    this.authDataKey = authDataKey
    this.makeUseAuthOutput = makeUseAuthOutput
    this.expirationHeadstart = expirationHeadstart ? ms(expirationHeadstart) : 0

    this.ensureActiveToken = this.ensureActiveToken.bind(this)
    this.useAuth = this.useAuth.bind(this)
  }

  public async ensureActiveToken() {
    await this.refreshTokenIfNeeded()
  }

  public async getAuthData() {
    await this.refreshTokenIfNeeded()
    return this.authData
  }

  public useAuth() {
    // Trigger refresh if necessary but don't await it
    this.refreshTokenIfNeeded()
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
      ...this.makeUseAuthOutput(authData),
      loggedIn: authData != null,
      logIn: this.logInAndSaveAuth,
      signUp: this.signUpAndSaveAuth,
      refreshToken: this.refreshToken,
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

  private logInAndSaveAuth = async (args: LoginArgs) => {
    const response = await this.logIn(args)
    this.updateAuthData(response)
  }

  private signUpAndSaveAuth = async (args: SignupArgs) => {
    const response = await this.signUp(args)
    this.updateAuthData(response)
  }

  private tokenHasExpired(authData: AuthData) {
    // Date.now() uses ms, token.exp uses s
    return (
      authData.tokenExp != null &&
      Date.now() > authData.tokenExp * 1000 - this.expirationHeadstart
    )
  }

  private async refreshTokenIfNeeded() {
    const authData = this.authData
    if (authData) {
      if (this.tokenHasExpired(authData) && !this.refreshRequestInFlight) {
        this.refreshRequestInFlight = true
        try {
          const newAuthData = await this.refreshToken(authData)
          this.updateAuthData(newAuthData)
          this.refreshRequestInFlight = false
        } catch (err) {
          console.error('Failed to refresh token: ', err)
        }
      }
    }
  }

  private async updateAuthData(authData: AuthData | null) {
    // Update localStorage with new auth data
    if (authData) {
      localStorage.setItem(this.authDataKey, JSON.stringify(authData))
    } else {
      localStorage.removeItem(this.authDataKey)
    }

    // Notify subscribed listeners
    this.notifyListeners(authData)
  }
}
