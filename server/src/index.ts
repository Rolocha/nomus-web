// Necessary for type-graphql and typegoose
import 'reflect-metadata'
import { app } from 'src/app'
import { APP_SERVER_PORT, BOT_SERVER_PORT } from 'src/config'
import slackApp from 'src/rolobot/slackApp'
;(async () => {
  // Start your app
  await slackApp.start(BOT_SERVER_PORT)
  console.log(`⚡️ Bolt app is running on ${BOT_SERVER_PORT}`)
})()

app.listen(Number(APP_SERVER_PORT), () => {
  console.log(`⚡️ Express server is running on localhost:${APP_SERVER_PORT}`)
})
