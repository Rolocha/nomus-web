import { User } from 'src/models'
import { createMigration } from './base-migration'

export default createMigration({
  name: 'phoneNumberE164Format',
  up: async () => {
    const users = await User.mongo.find({})
    console.log(`Migrating ${users.length} documents`)

    for (const user of users) {
      if (user.phoneNumber) {
        if (/^\d{10,11}$/.test(user.phoneNumber)) {
          user.phoneNumber =
            user.phoneNumber.length === 10 ? `+1${user.phoneNumber}` : `+${user.phoneNumber}`
          await user.save()
        } else {
          console.log(
            `Skipping user ${user.id} because their phone number is an unexpected format: ${user.phoneNumber}`
          )
        }
      } else {
        console.log(`Skipping user ${user.id} because they have no phone number`)
      }
    }
  },
  down: async () => {
    // No need to do anything since this is a non-destructive migration.
    // The only potential thing we could do here is to delete the UserProfile objects we created in up().
    // Not sure we want to do that
  },
})
