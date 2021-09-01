import { ChakraProvider } from '@chakra-ui/react'
import { css, Global } from '@emotion/react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import AOS from 'aos'
import 'aos/dist/aos.css'
import React from 'react'
import { ApolloProvider, client as apolloClient } from 'src/apollo'
import { PageRouter } from 'src/pages'
import { deployEnvironment } from 'src/config'
import theme from 'src/styles/theme'
import smoothscroll from 'smoothscroll-polyfill'

Sentry.init({
  dsn:
    'https://556f4f7a451c4d2b936f033098ff5cd2@o957716.ingest.sentry.io/5906724',
  integrations: [new Integrations.BrowserTracing()],
  environment: deployEnvironment,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

// kick off the polyfill!
smoothscroll.polyfill()

AOS.init()
// STRIPE_PUBLISHABLE_KEY is set via webpack.common.js during build process
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!)

interface PropsType {}
interface StateType {
  name: string
  greeting: string
}

class App extends React.Component<PropsType, StateType> {
  render() {
    return (
      <div className="App">
        <Global
          styles={css`
            body {
              margin: 0;
            }

            *,
            *:after,
            *:before {
              box-sizing: border-box;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6,
            h7,
            p {
              margin: 0;
            }

            img:not([src]) {
              visibility: hidden;
            }
          `}
        />
        <Elements
          stripe={stripePromise}
          options={{
            fonts: [
              {
                cssSrc:
                  'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap',
              },
            ],
          }}
        >
          <ApolloProvider client={apolloClient}>
            <ChakraProvider theme={theme}>
              <PageRouter />
            </ChakraProvider>
          </ApolloProvider>
        </Elements>
      </div>
    )
  }
}

export default App
