import { Ref as TypegooseRef } from '@typegoose/typegoose'
import { GraphQLScalarType } from 'graphql'

export type Ref<T> = TypegooseRef<T, string>

export const Void = new GraphQLScalarType({
  name: 'Void',

  description: 'Represents NULL values',

  serialize() {
    return null
  },

  parseValue() {
    return null
  },

  parseLiteral() {
    return null
  },
})

export const StringMap = new GraphQLScalarType({
  name: 'StringMap',
  description: 'Represents a map of string to strings',

  serialize(value: unknown) {},
})
