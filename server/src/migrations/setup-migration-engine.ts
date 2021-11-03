import path from 'path'
import dotenv from 'dotenv'

const pathToEnv = path.resolve(__dirname, '../../../.env')
dotenv.config({
  path: pathToEnv,
})
