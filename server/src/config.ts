import ms from 'ms'

export const authTokenPrivateKey = process.env.AUTH_TOKEN_PRIVATE_KEY
export const mongoCredentials = {
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  hostname: process.env.MONGO_HOSTNAME,
  port: process.env.MONGO_PORT,
  dbName: process.env.MONGO_DB_NAME,
}
export const nodeEnv = process.env.NODE_ENV ?? 'development'
export const appServerPort = process.env.APP_SERVER_PORT ?? '3000'

// Internal Config (not sourced from env vars)
export const graphqlPath = '/graphql'
export const refreshTokenLifespan = ms('30 days')
export const accessTokenLifespan = ms('15m')
export const s3BucketName = 'nomus-assets'

export const sendgridToken = process.env.SENDGRID_TOKEN
