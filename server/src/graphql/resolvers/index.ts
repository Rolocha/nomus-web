import { NonEmptyArray } from 'type-graphql'

import UserResolver from './user'
import CardVersionResolver from './cardVersion'

export default [UserResolver, CardVersionResolver] as NonEmptyArray<Function>
