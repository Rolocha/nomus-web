import { ApolloServer, AuthenticationError, ApolloError } from 'apollo-server-express'

import schema from 'src/graphql/schema'
import { getUserFromToken } from 'src/auth/util'

export const server = new ApolloServer({
  schema,
  // When we deploy to prod, we may want to disable this but in a way where we can still get
  // the playground in staging
  playground: true,
  introspection: true,
  context: async ({ req }) => {
    const authHeader = req.header('Authorization')
    if (authHeader == null || authHeader.trim() === '') {
      // Request not attempting authentication so let it through without assigning a user
      // Let query-by-query authorization happen down the pipeline
      return {}
    }

    const token = authHeader.replace(/^Bearer /, '')
    const userResult = await getUserFromToken(token)
    if (!userResult.isSuccess) {
      switch (userResult.error.name) {
        case 'missing-token':
        case 'no-matching-user':
        case 'jwt-error':
          throw new AuthenticationError('JWT error')
        case 'token-expired':
          throw new AuthenticationError('Token expired')
        default:
          throw new ApolloError('Unknown error')
      }
    }
    const user = userResult.getValue()
    return { user }
  },
})
