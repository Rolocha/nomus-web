import ms from 'ms'

export const AUTH_TOKEN_PRIVATE_KEY = process.env.AUTH_TOKEN_PRIVATE_KEY
export const DEPLOY_ENV = process.env.ENV as 'development' | 'staging' | 'production'
export const NODE_ENV = (process.env.NODE_ENV ?? 'development') as 'development' | 'production'
export const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
export const APP_SERVER_PORT = process.env.APP_SERVER_PORT ?? '3000'
export const SENDGRID_TOKEN =
  process.env.NODE_ENV === 'test'
    ? 'SG.whatever-as-long-as-it-starts-with-SG'
    : process.env.SENDGRID_TOKEN
export const MONGO_DB_URI =
  process.env.NODE_ENV === 'test' ? process.env.MONGO_URL : process.env.MONGO_DB_URI

// Internal Config (not sourced from env vars)
export const REFRESH_TOKEN_LIFESPAN = ms('30 days')
export const ACCESS_TOKEN_LIFESPAN = ms('15m')
export const EMAIL_VERIFICATION_TOKEN_LIFESPAN = ms('24 hours')
export const PASSWORD_RESET_TOKEN_LIFESPAN = ms('24 hours')
export const S3_BUCKET_NAME = 'nomus-assets'
export const STRIPE_TOKEN = process.env.STRIPE_TOKEN
export const SHIPPO_TOKEN = process.env.SHIPPO_TOKEN
export const STRIPE_WEBHOOK_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET
export const BASE_URL =
  {
    development: 'http://localhost:1234',
    staging: 'https://stage.nomus.me',
    production: 'https://nomus.me',
  }[DEPLOY_ENV] ?? 'https://testing.nomus.me'

export const ACCESS_TOKEN_COOKIE_NAME = 'X-Access-Token'
export const REFRESH_TOKEN_COOKIE_NAME = 'X-Refresh-Token'
export const RESERVED_ROUTES = [
  'about',
  'api',
  'auth',
  'card-builder',
  'card-studio',
  'careers',
  'd',
  'dashboard',
  'dashboard',
  'design',
  'faq',
  'faq',
  'get-started',
  'hello',
  'jobs',
  'login',
  'profile',
  'profile',
  'register',
  'registration',
  'shop',
  'signup',
]
export const MINIMUM_PASSWORD_STRENGTH = 2 // on zxcvbn's 0-4 scale
