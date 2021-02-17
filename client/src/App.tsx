import { css, Global } from '@emotion/react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ThemeProvider } from '@emotion/react'
import React from 'react'
import { ApolloProvider, client as apolloClient } from 'src/apollo'
import { PageRouter } from 'src/pages'
import theme from 'src/styles/theme'

AOS.init()
const stripePromise = loadStripe('pk_test_BHZBEPSq17NwCwSopGfQIfTs00pTG0HM75')

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
            <ThemeProvider theme={theme}>
              <PageRouter />
            </ThemeProvider>
          </ApolloProvider>
        </Elements>
      </div>
    )
  }
}

export default App
