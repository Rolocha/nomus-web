import * as React from 'react'
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom'

import { AuthLevel } from 'src/config'
import ProtectedRoute from 'src/components/ProtectedRoute'

import ComingSoonPage from 'src/pages/ComingSoonPage/index'

interface PageType {
  name: string
  path: string
  exact?: boolean // default is false
  component: (...args: any) => JSX.Element | null
  requiredAuthLevel?: AuthLevel
}

export const pages: Array<PageType> = [
  {
    name: 'landing',
    exact: false,
    path: '/',
    component: ComingSoonPage,
  },
]

export const PageRouter = () => {
  return (
    <Router>
      <Switch>
        {pages.map(({ name, requiredAuthLevel, ...rest }) =>
          requiredAuthLevel == null ? (
            <Route key={name} {...rest} />
          ) : (
            <ProtectedRoute
              key={name}
              requiredAuthLevel={requiredAuthLevel}
              {...rest}
            />
          ),
        )}
      </Switch>
    </Router>
  )
}

export default pages
