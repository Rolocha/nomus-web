import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import link from './links'

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

export { gql } from 'apollo-boost'
export {
  useQuery,
  useLazyQuery,
  useMutation,
  ApolloProvider,
} from '@apollo/react-hooks'
