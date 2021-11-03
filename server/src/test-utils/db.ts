import mongoose from 'mongoose'
import { MONGO_DB_URI } from 'src/config'

export const initDB = async () => {
  try {
    // Disconnect from any existing connections (e.g. if you imported {app} from src/app in the test file calling this method)
    await mongoose.disconnect()
    await mongoose.connect(MONGO_DB_URI, {
      dbName: 'nomus-dev',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
  } catch (err) {
    console.log('Failed to connect to MongoDB')
    console.log(err)
  }
}

export async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // This error happens when you try to drop a collection that's already dropped. Happens infrequently.
      // Safe to ignore.
      if (error.message === 'ns not found') continue

      // This error happens when you use it.todo.
      // Safe to ignore.
      if (error.message.includes('a background operation is currently running')) continue

      console.log(error.message)
    }
  }
}

export const cleanUpDB = async () => {
  await dropAllCollections()
  await mongoose.connection.close()
}
