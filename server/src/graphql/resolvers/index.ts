import { NonEmptyArray } from 'type-graphql'

import UserResolver from './user'
import ContactInfoResolver from './contactInfo'
import CardVersionResolver from './cardVersion'

export default [UserResolver, ContactInfoResolver, CardVersionResolver] as NonEmptyArray<Function>
