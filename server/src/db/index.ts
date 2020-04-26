import mongoose from 'mongoose'
import { nodeEnv, mongoCredentials } from 'src/config'

export function init() {
  // Only connect to the database for non-test environments
  if (nodeEnv !== 'test') {
    const dbUri = `mongodb://${mongoCredentials.username}:${mongoCredentials.password}@${mongoCredentials.hostname}:${mongoCredentials.port}/${mongoCredentials.dbName}?authSource=admin`
    mongoose
      .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Successfully connected to MongoDB')
      })
      .catch((err) => {
        console.log('Failed to connect to MongoDB')
        console.log(err)
      })

    mongoose.Promise = global.Promise

    mongoose.connection.on('error', (error) => {
      console.log('Mongoose error', error)
    })
  }
}
