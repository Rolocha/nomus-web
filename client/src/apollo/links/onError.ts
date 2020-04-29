import { onError } from 'apollo-link-error'
import { Observable } from 'apollo-link'

import { ensureActiveToken } from 'src/utils/auth'

export default onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (networkError) {
      if ('statusCode' in networkError && networkError.statusCode === 401) {
        // Outgoing request got 401'd by the server
        return new Observable((observer) => {
          // Trigger a token refresh
          ensureActiveToken()
            .then((activeTokenExists) => {
              if (activeTokenExists) {
                // Retry the failed request
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                })
              } else {
                throw new Error('Token refresh failed')
              }
            })
            .catch((err) => {
              observer.error(err)
            })
        })
      }
      console.log(`[Network error]: ${networkError}`)
    }

    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      )
  },
)
