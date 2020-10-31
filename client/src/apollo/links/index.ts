import { ApolloLink } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'

import onErrorLink from './onError'
import authLink from './auth'

export default ApolloLink.from([
  onErrorLink,
  authLink,
  // @ts-ignore
  createUploadLink({
    uri: '/graphql',
    credentials: 'same-origin',
  }),
])
