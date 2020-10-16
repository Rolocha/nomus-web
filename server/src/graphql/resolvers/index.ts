import { NonEmptyArray } from 'type-graphql'

import UserResolver from './user'
import CardVersionResolver from './cardVersion'
import ContactsResolver from './contacts'
import OrderResolver from './order'

export default [
  ContactsResolver,
  UserResolver,
  CardVersionResolver,
  OrderResolver,
] as NonEmptyArray<Function>
