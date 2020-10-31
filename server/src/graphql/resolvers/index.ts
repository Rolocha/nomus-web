import { NonEmptyArray } from 'type-graphql'

import UserResolver from './user'
import CardVersionResolver from './cardVersion'
import ContactsResolver from './contacts'
import OrderResolver from './order'
import SheetResolver from './sheet'
import ManufacturingResolver from './manufacturing'

export default [
  ContactsResolver,
  UserResolver,
  CardVersionResolver,
  OrderResolver,
  SheetResolver,
  ManufacturingResolver,
] as NonEmptyArray<Function>
