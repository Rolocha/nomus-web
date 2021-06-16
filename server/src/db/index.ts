import mongoose from 'mongoose'

export async function init(options = {}) {
  let connection
  try {
    connection = await mongoose.connect(
      process.env.NODE_ENV === 'test' ? process.env.MONGO_URL : process.env.MONGO_DB_URI,
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
