import { NonEmptyArray } from 'type-graphql'

import UserResolver from './user'
import CardVersionResolver from './cardVersion'
import ContactsResolver from './contacts'
import OrderResolver from './order'
import SheetResolver from './sheet'
import SheetOrderResolver from './sheetOrder'
import LinkerResolver from './linker'
import OrderEventResolver from './orderEvent'
import NomusProSubscriptionResolver from './nomusProSubscription'

export default [
  ContactsResolver,
  UserResolver,
  CardVersionResolver,
  OrderResolver,
  SheetResolver,
  SheetOrderResolver,
  LinkerResolver,
  OrderEventResolver,
  NomusProSubscriptionResolver,
] as NonEmptyArray<Function>
