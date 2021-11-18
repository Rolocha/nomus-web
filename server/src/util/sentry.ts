import * as Sentry from '@sentry/node'

// Importing @sentry/tracing patches the global hub for tracing to work.
import '@sentry/tracing'

export const setUpSentry = () => {
  Sentry.init({
    dsn: 'https://556f4f7a451c4d2b936f033098ff5cd2@o957716.ingest.sentry.io/5906724',
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  })
}
