import { Role } from 'src/utils/auth'

export const AUTH_DATA_KEY = 'authData'
export type AuthLevel = Role | null | undefined
export const deployEnvironment =
  ({
    localhost: 'development',
    'stage.nomus.me': 'staging',
    'nomus.me': 'production',
  } as Record<string, string>)[window?.location?.hostname] ?? 'unknown'
