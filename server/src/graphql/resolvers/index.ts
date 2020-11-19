import { NonEmptyArray } from 'type-graphql'

import UserResolver from './user'
import CardVersionResolver from './cardVersion'
import ContactsResolver from './contacts'
import OrderResolver from './order'
import SheetResolver from './sheet'
import ManufacturingResolver from './manufacturing'
import LinkerResolver from './linker'

export default [
  ContactsResolver,
  UserResolver,
  CardVersionResolver,
  OrderResolver,
  SheetResolver,
  ManufacturingResolver,
  LinkerResolver,
] as NonEmptyArray<Function>
