import { createMigration } from './base-migration'

export default createMigration({
  name: 'setDefaultCardVersion',
  up: async ({ mongoClient, db }) => {
    db.listCollections()
    const usersCollection = db.collection('users')
    const cardVersionsCollection = db.collection('cardversions')

    const usersWithMissingDefaultCardVersionCursor = usersCollection.find({
      defaultCardVersion: null,
    })

    const dbSession = mongoClient.startSession()
    dbSession.startTransaction()

    while (await usersWithMissingDefaultCardVersionCursor.hasNext()) {
      const user = await usersWithMissingDefaultCardVersionCursor.next()
      const cardVersionsForUserCursor = cardVersionsCollection.find({
        user: user._id,
      })
      // If the user doesn't even have one card version, this migration isn't for them
      if (!(await cardVersionsForUserCursor.hasNext())) {
        continue
      }
      const cardVersion = await cardVersionsForUserCursor.next()
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { defaultCardVersion: cardVersion._id } }
      )
    }

    dbSession.commitTransaction()
    mongoClient.close()
  },
  down: async () => {
    throw new Error('migrate up not yet implemented for fixNestedSheetCards')
  },
})
