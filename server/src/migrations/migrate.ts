// This import must come first since it sets up the env vars
import './setup-migration-engine'

import path from 'path'
import fs from 'fs'
import { Migrator } from './base-migration'
import * as db from 'src/db'

const migrationName = process.argv[2]

const migrate = async () => {
  await db.init()
  const migrationFilePath = path.resolve(__dirname, migrationName)
  const migrationFileExists = fs.existsSync(migrationFilePath)
  if (!migrationFileExists) {
    console.log(`⚠️ Could not find a migration named ${migrationName}`)
    return
  }

  const migrator: Migrator = (await import(migrationFilePath)).default
  try {
    await migrator.execute()
  } catch (err) {
    console.log('Migration failed with error', err)
  }
  console.log('Done!')
}

migrate().finally(() => {
  process.exit(0)
})
