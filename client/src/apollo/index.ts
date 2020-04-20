import ApolloClient from 'apollo-boost'

import { AUTH_TOKEN_KEY } from 'config'

export const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    })
  },
})

export { gql } from 'apollo-boost'
export {
  useQuery,
  useLazyQuery,
  useMutation,
  ApolloProvider,
} from '@apollo/react-hooks'
