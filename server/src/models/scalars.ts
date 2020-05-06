import { DocumentType } from '@typegoose/typegoose'
import { GraphQLScalarType, Kind } from 'graphql'
import MUUID, { MUUID as MUUIDType } from 'uuid-mongodb'

export type UUIDType = MUUIDType

export type Ref<T> = UUIDType | DocumentType<T>

export const UUIDScalar = new GraphQLScalarType({
  name: 'MUUID',
  description: 'Mongo UUID type',
  parseValue(value: string): UUIDType {
    // return new ObjectId(value); // value from the client input variables
    return MUUID.from(value)
  },
  serialize(value: UUIDType) {
    return MUUID.from(value).toString() // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return MUUID.from(ast.value) // value from the client query
    }
    return null
  },
})
