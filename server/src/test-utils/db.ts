import mongoose from 'mongoose'

export const initDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    console.log('Connected to test DB')
  } catch (err) {
    console.log('Failed to connect to MongoDB')
    console.log(err)
  }
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // This error happens when you try to drop a collection that's already dropped. Happens infrequently.
      // Safe to ignore.
      if (error.message === 'ns not found') return

      // This error happens when you use it.todo.
      // Safe to ignore.
      if (error.message.includes('a background operation is currently running')) return

      console.log(error.message)
    }
  }
}

export const cleanUpDB = async () => {
  await dropAllCollections()
  await mongoose.connection.close()
}
