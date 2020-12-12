// Heavily inspired by https://github.com/obabichev/react-token-auth

import { useEffect, useState } from 'react'
import ms from 'ms'

export interface BaseAuthData {
  tokenExp: number
}

interface AuthResponse<Data> {
  data?: Data
  error?: {
    code: string
  }
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
  logIn: (args: LoginArgs) => Promise<AuthResponse<AuthData>>
  // An async function that hits your signup endpoint and responds with auth data
  signUp: (args: SignupArgs) => Promise<AuthResponse<AuthData>>
  // An async function that logs the user out and returns true on success, false otherwise
  logOut: () => Promise<boolean>
  // An async function that hits your refresh endpoint and responds with a new access token
  refreshToken: (authData: AuthData) => Promise<AuthResponse<AuthData>>
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
  private logIn: (args: LoginArgs) => Promise<AuthResponse<AuthData>>
  private signUp: (args: SignupArgs) => Promise<AuthResponse<AuthData>>
  private logOut: () => Promise<boolean>
  private refreshToken: (args: AuthData) => Promise<AuthResponse<AuthData>>
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
    logOut,
    refreshToken,
    makeUseAuthOutput,
    expirationHeadstart,
  }: AuthManagerOptions<LoginArgs, SignupArgs, UseAuthOutput, AuthData>) {
    this.logIn = logIn
    this.signUp = signUp
    this.logOut = logOut
    this.refreshToken = refreshToken
    this.authDataKey = authDataKey
    this.makeUseAuthOutput = makeUseAuthOutput
    this.expirationHeadstart = expirationHeadstart ? ms(expirationHeadstart) : 0

    this.ensureActiveToken = this.ensureActiveToken.bind(this)
    this.useAuth = this.useAuth.bind(this)
  }

  // Resolves to whether an active token exists by the time this function is awaited
  public async ensureActiveToken(forceRefresh = false): Promise<boolean> {
    const authData = this.authData
    if (!authData) {
      return false
    }

    // We have auth data, now check if it is non-expired
    if (!forceRefresh && !this.tokenHasExpired(authData)) {
      return true
    }

    // Looks like the token expired (or the caller wants to force a refresh), try refreshing it
    const wasTokenRefreshed = await this._refreshToken(authData)
    return wasTokenRefreshed
  }

  public logOutAndClearData = async () => {
    this.updateAuthData(null)
    await this.logOut()
  }

  public useAuth() {
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
      loggedIn: authData != null && !this.tokenHasExpired(authData),
      logIn: this.logInAndSaveAuth,
      signUp: this.signUpAndSaveAuth,
      logOut: this.logOutAndClearData,
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
    if (response.data) {
      this.updateAuthData(response.data)
    }
    return response
  }

  private signUpAndSaveAuth = async (args: SignupArgs) => {
    const response = await this.signUp(args)
    if (response.data) {
      this.updateAuthData(response.data)
    }
    return response
  }

  private tokenHasExpired(authData: AuthData) {
    // Date.now() uses ms, token.exp uses s
    return (
      authData.tokenExp != null &&
      Date.now() > authData.tokenExp * 1000 - this.expirationHeadstart
    )
  }

  // Resolves to a boolean specifying whether the token was refreshed
  private async _refreshToken(authData: AuthData): Promise<boolean> {
    try {
      const response = await this.refreshToken(authData)
      if (response.data) {
        this.updateAuthData(response.data)
        return true
      }
      return false
    } catch (err) {
      return false
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
