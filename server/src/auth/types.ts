import { Role } from 'src/models/User'

export interface TokenBody {
  _id: string
  exp: number
  roles: Role[]
}
