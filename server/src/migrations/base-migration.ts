import MigrationEvent from 'src/models/MigrationEvent'

export interface MigrationArgs {
  name: string
  up: () => Promise<void>
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

      await up()
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
