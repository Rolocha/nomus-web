import ms from 'ms'

export const AUTH_TOKEN_PRIVATE_KEY = process.env.AUTH_TOKEN_PRIVATE_KEY
export const MONGO_CREDENTIALS = {
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  hostname: process.env.MONGO_HOSTNAME,
  port: process.env.MONGO_PORT,
  dbName: process.env.MONGO_DB_NAME,
  // Manually defined URI string, if omitted, builds a basic one based on the details above
  dbUri: process.env.MONGO_DB_URI,
}
export const NODE_ENV = process.env.NODE_ENV ?? 'development'
export const APP_SERVER_PORT = process.env.APP_SERVER_PORT ?? '3000'
export const SENDGRID_TOKEN =
  process.env.NODE_ENV === 'test'
    ? 'SG.whatever-as-long-as-it-starts-with-SG'
    : process.env.SENDGRID_TOKEN

// Internal Config (not sourced from env vars)
export const REFRESH_TOKEN_LIFESPAN = ms('30 days')
export const ACCESS_TOKEN_LIFESPAN = ms('15m')
export const EMAIL_VERIFICATION_TOKEN_LIFESPAN = ms('24 hours')
export const PASSWORD_RESET_TOKEN_LIFESPAN = ms('24 hours')
export const S3_BUCKET_NAME = 'nomus-assets'
export const STRIPE_TOKEN = process.env.STRIPE_TOKEN
export const BASE_URL =
  {
    development: 'http://localhost:1234',
    staging: 'https://stage.nomus.me',
    production: 'https://nomus.me',
  }[process.env.ENV] ?? 'https://testing.nomus.me'

export const ACCESS_TOKEN_COOKIE_NAME = 'X-Access-Token'
export const REFRESH_TOKEN_COOKIE_NAME = 'X-Refresh-Token'
export const RESERVED_ROUTES = [
  'about',
  'api',
  'auth',
  'card-builder',
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
  'signup',
]
