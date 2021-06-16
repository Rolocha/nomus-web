import path from 'path'
import { Migrator } from './base-migration'
import * as db from 'src/db'
import dotenv from 'dotenv'

const pathToEnv = path.resolve(__dirname, '../../../.env')
dotenv.config({
  path: pathToEnv,
})

const migrationFile = process.argv[2]

const migrate = async () => {
  await db.init()
  const migrator: Migrator = (await import(`./${migrationFile}`)).default
  await migrator.execute()
  console.log('Done!')
}

migrate().finally(() => {
  process.exit(0)
})
