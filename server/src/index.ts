// Necessary for type-graphql and typegoose
import 'reflect-metadata'
import { app } from 'src/app'
import { appServerPort } from 'src/config'

app.listen(Number(appServerPort), () => {
  console.log(`⚡️ Express server is running on localhost:${appServerPort}`)
})
