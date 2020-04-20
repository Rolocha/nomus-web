import { ApolloServer } from 'apollo-server-express'

import schema from 'src/graphql/schema'
import { authorizeRequest } from 'src/graphql/util'

export const server = new ApolloServer({
  schema,
  // When we deploy to prod, we may want to disable this but in a way where we can still get
  // the playground in staging
  playground: true,
  introspection: true,
  context: async ({ req }) => {
    try {
      const user = await authorizeRequest(req)
      return { user }
    } catch (err) {
      return {}
    }
  },
})
