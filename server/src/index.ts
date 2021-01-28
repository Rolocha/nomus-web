// Necessary for type-graphql and typegoose
import 'reflect-metadata'
import { app } from 'src/app'
import { APP_SERVER_PORT } from 'src/config'

app.listen(Number(APP_SERVER_PORT), () => {
  console.log(`⚡️ Express server is running on localhost:${APP_SERVER_PORT}`)
})
