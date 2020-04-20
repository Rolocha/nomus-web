import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Global, css } from '@emotion/core'
import { ThemeProvider } from 'emotion-theming'
import AOS from 'aos'
import 'aos/dist/aos.css'

import { client as apolloClient, ApolloProvider } from 'apollo'
import pages from 'pages'
import theme from 'styles/theme'

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
          `}
        />
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <Router>
              <Switch>
                {pages.map(({ exact, path, component }) => (
                  <Route
                    key={path}
                    exact={exact}
                    path={path}
                    component={component}
                  />
                ))}
              </Switch>
            </Router>
          </ThemeProvider>
        </ApolloProvider>
      </div>
    )
  }
}

export default App
