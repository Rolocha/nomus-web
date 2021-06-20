import { ApolloServer } from 'apollo-server-express'
import { DEPLOY_ENV } from 'src/config'

import schema from 'src/graphql/schema'

export const server = new ApolloServer({
  schema,
  // When we deploy to prod, we may want to disable this but in a way where we can still get
  // the playground in staging
  playground:
    DEPLOY_ENV !== 'production'
      ? {
          settings: {
            'request.credentials': 'same-origin',
          },
        }
      : false,
  introspection: DEPLOY_ENV !== 'production',
  context: ({ req }) => {
    if (req.user) {
      return { user: req.user }
    }
  },
})
