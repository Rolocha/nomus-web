import { setContext } from 'apollo-link-context'

import { getToken } from 'src/utils/auth'

// from https://www.apollographql.com/docs/react/migrating/boost-migration/
export default setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await getToken()
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
