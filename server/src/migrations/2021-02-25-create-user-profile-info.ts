import { User, UserProfile } from 'src/models'
import { createMigration } from './base-migration'

export default createMigration({
  name: 'createUserProfileInfo',
  up: async () => {
    const users = await User.mongo.find({})
    console.log(`Migrating ${users.length} documents`)
    for (const user of users) {
      const userProfileInfo = {
        user: user.id,
        profilePicS3Key: user.profilePicS3Key,
        phoneNumber: user.phoneNumber,
        email: user.email,
        defaultCardVersion: user.defaultCardVersion,
        vcfUrl: user.vcfUrl,
      }
      await UserProfile.mongo.create(userProfileInfo)

      // We explicitly don't want to unset any fields from User in this migration
      // since we'll need to change the code over to pull that info from UserProfile first
    }
  },
  down: async () => {
    // No need to do anything since this is a non-destructive migration.
    // The only potential thing we could do here is to delete the UserProfile objects we created in up().
    // Not sure we want to do that
  },
})
