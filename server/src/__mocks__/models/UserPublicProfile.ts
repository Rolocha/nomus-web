import { UserPublicProfile, UserPublicProfileModel } from 'src/models/UserPublicProfile'

export const createMockUserPublicProfile = async (
  profileOverride: Partial<UserPublicProfile> = {}
) => {
  const newProfilePayload: Partial<UserPublicProfile> = {
    headline: 'Founding Father',
    bio: 'No taxation without representation! #downwithtyranny',
    phoneNumber: '5555555555',
    ...profileOverride,
  }

  return await UserPublicProfileModel.create(newProfilePayload)
}
