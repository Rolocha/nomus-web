import mongoose from 'mongoose'
import { mongoCredentials } from 'src/config'

export async function init(options: Partial<typeof mongoCredentials> = {}) {
  const {
    dbName = mongoCredentials.dbName,
    username = mongoCredentials.username,
    password = mongoCredentials.password,
    hostname = mongoCredentials.hostname,
    port = mongoCredentials.port,
    hosts = mongoCredentials.hosts,
  } = options
  const hostsString = hosts ?? `${hostname}:${port}`
  const dbUri = `mongodb://${username}:${password}@${hostsString}/${dbName}`
  let connection
  try {
    connection = await mongoose.connect(dbUri, {
      // Required to silence various deprecation warnings: https://mongoosejs.com/docs/deprecations.html
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
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
