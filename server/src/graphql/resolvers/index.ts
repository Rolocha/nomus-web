import { NonEmptyArray } from 'type-graphql'

import UserResolver from './user'
import CardVersionResolver from './cardVersion'
import ContactsResolver from './contacts'

export default [ContactsResolver, UserResolver, CardVersionResolver] as NonEmptyArray<Function>
