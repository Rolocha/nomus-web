import { User } from 'src/models'

export const ReservedRoutes = ['dashboard', 'profile', 'faq']

export const validateUsername = async (usernameVal: string): Promise<boolean> => {
  const exists = await User.mongo.find({ username: usernameVal }).limit(1)

  if (exists.length > 0) {
    return false
  }

  if (ReservedRoutes.includes(usernameVal)) {
    return false
  }

  return true
}
