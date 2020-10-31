import { ApolloClient, InMemoryCache } from '@apollo/client'
import link from './links'
import { useQuery as _useQuery } from '@apollo/react-hooks'

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

const SPEC_SKIP_CACHE =
  process.env.NODE_ENV === 'test' ? ({ fetchPolicy: 'no-cache' } as const) : {}
export const useQuery: typeof _useQuery = (...args) => {
  return _useQuery(args[0], { ...SPEC_SKIP_CACHE, ...args[1] })
}

export { ApolloProvider, useLazyQuery, useMutation } from '@apollo/react-hooks'
export { gql } from 'apollo-boost'
