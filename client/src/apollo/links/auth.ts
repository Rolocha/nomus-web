import { setContext } from 'apollo-link-context'

import { ensureActiveToken } from 'src/utils/auth'

// from https://www.apollographql.com/docs/react/migrating/boost-migration/
export default setContext(async (_, { headers }) => {
  // Request the auth manager to ensure that an active token is present,
  // triggering a token refresh if necessary. The token travels in an
  // httpOnly cookie so setting it on a header here isn't necessary
  await ensureActiveToken()
})
