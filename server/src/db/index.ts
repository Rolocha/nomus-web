import mongoose from 'mongoose'
import { MONGO_CREDENTIALS } from 'src/config'

export async function init(options: Partial<typeof MONGO_CREDENTIALS> = {}) {
  const {
    dbName = MONGO_CREDENTIALS.dbName,
    username = MONGO_CREDENTIALS.username,
    password = MONGO_CREDENTIALS.password,
    hostname = MONGO_CREDENTIALS.hostname,
    port = MONGO_CREDENTIALS.port,
    dbUri: dbUriOverride = MONGO_CREDENTIALS.dbUri,
  } = options

  const dbUri = dbUriOverride ?? `mongodb://${username}:${password}@${hostname}:${port}/${dbName}`
  let connection
  try {
    connection = await mongoose.connect(
      process.env.NODE_ENV === 'test' ? process.env.MONGO_URL : dbUri,
      {
        // Required to silence various deprecation warnings: https://mongoosejs.com/docs/deprecations.html
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    )
  } catch (err) {
    console.log('Failed to connect to MongoDB')
    console.log(err)
  }

  mongoose.Promise = global.Promise

  mongoose.connection.on('error', (error) => {
    console.log('Mongoose error', error)
  })
  return connection
}
