import { buildSchemaSync } from 'type-graphql'
import resolvers from 'src/graphql/resolvers'

const schema = buildSchemaSync({
  resolvers,
})
export default schema
