import { NonEmptyArray } from 'type-graphql'

import UserResolver from './user'
import ContactInfoResolver from './contactInfo'

export default [UserResolver, ContactInfoResolver] as NonEmptyArray<Function>
