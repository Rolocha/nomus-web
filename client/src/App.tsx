import { css, Global } from '@emotion/core'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ThemeProvider } from 'emotion-theming'
import React from 'react'
import { ApolloProvider, client as apolloClient } from 'src/apollo'
import { PageRouter } from 'src/pages'
import theme from 'src/styles/theme'

AOS.init()

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
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <PageRouter />
          </ThemeProvider>
        </ApolloProvider>
      </div>
    )
  }
}

export default App
