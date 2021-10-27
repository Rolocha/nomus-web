import { MongoClient, Db as MongoClientDb } from 'mongodb'
import { MONGO_DB_URI } from 'src/config'
import MigrationEvent from 'src/models/MigrationEvent'

export interface MigrationUpArgs {
  mongoClient: MongoClient
  db: MongoClientDb
}

export interface MigrationArgs {
  name: string
  up: (args: MigrationUpArgs) => Promise<void>
  down: () => Promise<void>
}

export interface Migrator {
  execute: () => Promise<void>
  revert: () => Promise<void>
}

export const createMigration = ({ name, up, down }: MigrationArgs): Migrator => {
  const execute = async () => {
    try {
      const existingMigrations = await MigrationEvent.mongo.find({ migrationName: name })
      if (existingMigrations.length !== 0) {
        throw new Error('You cannot run the same migration twice')
      }

      const mongoClient = new MongoClient(MONGO_DB_URI)
      await mongoClient.connect()
      const db = mongoClient.db('nomus-dev')

      await up({ mongoClient, db })
      await MigrationEvent.mongo.create({
        migrationName: name,
      })
    } catch (err) {
      console.error('Migration failed: ', err)
    }
  }

  const revert = async () => {
    console.log('TODO')
  }

  return { execute, revert }
}
