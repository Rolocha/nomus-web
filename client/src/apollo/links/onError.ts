import * as Sentry from '@sentry/react'
import { onError } from '@apollo/client/link/error'
import { Observable } from '@apollo/client/core'

import { ensureActiveToken, logOutAndClearData } from 'src/utils/auth'

export default onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (networkError) {
      Sentry.captureException(networkError)
    }

    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        const { message, locations, path } = error
        Sentry.captureException(error)
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        )
      })
    }

    if (
      (networkError &&
        'statusCode' in networkError &&
        networkError.statusCode === 401) ||
      (graphQLErrors &&
        graphQLErrors.some((err) => err.message.startsWith('Access denied!')))
    ) {
      // Outgoing request got 401'd by the server
      return new Observable((observer) => {
        // Trigger a token refresh
        ensureActiveToken(true)
          .then((activeTokenExists) => {
            if (activeTokenExists) {
              // Retry the failed request
              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              })
            } else {
              Sentry.captureException(new Error('Token refresh failed'))
            }
          })
          .catch((err) => {
            observer.error(err)
            Sentry.captureException(err)
            logOutAndClearData()
          })
      })
    }
  },
)
