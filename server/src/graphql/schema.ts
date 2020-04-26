import { buildSchemaSync } from 'type-graphql'
import resolvers from 'src/graphql/resolvers'
import { schemaAuthChecker } from 'src/graphql/util'

const schema = buildSchemaSync({
  resolvers,
  authChecker: schemaAuthChecker,
})
export default schema
