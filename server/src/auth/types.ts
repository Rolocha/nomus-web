import { Role } from 'src/util/enums'

export interface TokenBody {
  _id: string
  exp: number
  roles: Role[]
}
