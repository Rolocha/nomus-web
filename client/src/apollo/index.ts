import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import link from './links'

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

export {
  ApolloProvider,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/react-hooks'
export { gql } from 'apollo-boost'
