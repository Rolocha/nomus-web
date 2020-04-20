import mongoose from 'mongoose'

const {
  NODE_ENV,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB_NAME,
} = process.env

/**
 * @typedef {Object} ObjectId
 */

export function init() {
  // Only connect to the database for non-test environments
  if (NODE_ENV !== 'test') {
    const DB_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`
    mongoose
      .connect(DB_URI, {
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
