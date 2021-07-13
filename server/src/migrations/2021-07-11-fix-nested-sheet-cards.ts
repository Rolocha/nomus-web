import { MongoClient } from 'mongodb'
import { createMigration } from './base-migration'

const client = new MongoClient(process.env.MONGO_DB_URI)

export default createMigration({
  name: 'fixNestedSheetCards',
  up: async () => {
    await client.connect()
    const db = client.db('nomus-dev')
    const sheetsCollection = db.collection('sheets')

    // Find all sheets where the cards property is an array of arrays, e.g
    //   [["card_abc"], ["card_xyz"]]
    // so we can correct it to a flattened version
    //   ["card_abc", "card_xyz"]
    const brokenSheetsCursor = sheetsCollection.find({
      cards: { $elemMatch: { $type: 'array' } },
    })

    const dbSession = client.startSession()
    dbSession.startTransaction()

    while (await brokenSheetsCursor.hasNext()) {
      const sheet = await brokenSheetsCursor.next()
      const updatedCards = (sheet.cards as string[][]).flat()
      console.log(`Updating ${sheet._id}`)
      await sheetsCollection.updateOne({ _id: sheet._id }, { $set: { cards: updatedCards } })
    }

    dbSession.commitTransaction()
    client.close()
  },
  down: async () => {
    throw new Error('migrate up not yet implemented for fixNestedSheetCards')
  },
})
