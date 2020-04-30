import mongoose from 'mongoose'
import { nodeEnv, mongoCredentials } from 'src/config'

export async function init() {
  // Only connect to the database for non-test environments
  if (nodeEnv !== 'test') {
    const dbUri = `mongodb://${mongoCredentials.username}:${mongoCredentials.password}@${mongoCredentials.hostname}:${mongoCredentials.port}/${mongoCredentials.dbName}?authSource=admin`
    try {
      await mongoose.connect(dbUri, {
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
  }
}
