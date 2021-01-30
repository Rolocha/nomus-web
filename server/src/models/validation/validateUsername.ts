import { RESERVED_ROUTES } from 'src/config'
import { Result } from 'src/util/error'
import { User } from '../User'

export type ValidateUsernameResult = Result<
  null,
  'empty-username' | 'reserved-route' | 'non-unique-username' | 'unknown-error'
>
export async function validateUsername(username: string): Promise<ValidateUsernameResult> {
  const exists = await User.mongo.find({ username: username }).limit(1)

  if (exists.length > 0) {
    return Result.fail('non-unique-username')
  }

  if (RESERVED_ROUTES.includes(username)) {
    return Result.fail('reserved-route')
  }

  if (username == null) {
    return Result.fail('empty-username')
  }

  return Result.ok()
}

export default validateUsername
