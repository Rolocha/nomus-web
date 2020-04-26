import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'

import onErrorLink from './onError'
import authLink from './auth'

export default ApolloLink.from([
  onErrorLink,
  authLink,
  new HttpLink({
    uri: '/graphql',
    credentials: 'same-origin',
  }),
])
