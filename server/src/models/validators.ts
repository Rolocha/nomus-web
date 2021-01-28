import { RESERVED_ROUTES } from 'src/config'
import { Result } from 'src/util/error'
import { User } from './User'

export function validateEmail(email: string): boolean {
  // eslint-disable-next-line no-control-regex
  const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  return re.test(email)
}

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
