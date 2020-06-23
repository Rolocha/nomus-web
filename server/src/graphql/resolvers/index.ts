import { NonEmptyArray } from 'type-graphql'

import UserResolver from './user'
import CardVersionResolver from './cardVersion'
import ContactsResolver from './contacts'
import OrderResolver from './orderResolver'

export default [
  ContactsResolver,
  UserResolver,
  CardVersionResolver,
  OrderResolver,
] as NonEmptyArray<Function>
