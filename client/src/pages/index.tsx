import * as React from 'react'
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom'

import { AuthLevel } from 'src/config'
import { Role } from 'src/utils/auth'
import ProtectedRoute from 'src/components/ProtectedRoute'

import LandingPage from 'src/pages/LandingPage'
import UserControlPanel from 'src/pages/UserControlPanel'
import CardBuilder from 'src/pages/CardBuilder'
import LoginPage from 'src/pages/LoginPage'
import ContactInfoPage from 'src/pages/ContactInfoPage'
import AdminPanel from 'src/pages/AdminPanel'
import FourOhFourPage from 'src/pages/FourOhFour'

interface PageType {
  name: string
  path?: string
  exact?: boolean // default is false
  component: (...args: any) => JSX.Element | null
  requiredAuthLevel?: AuthLevel
}

export const pages: Array<PageType> = [
  {
    name: 'landing',
    exact: true,
    path: '/',
    component: LandingPage,
  },
  {
    name: 'login',
    exact: true,
    path: '/login',
    component: LoginPage,
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: UserControlPanel,
    requiredAuthLevel: Role.User,
  },
  {
    name: 'card studio',
    path: '/card-studio/:buildBaseType?',
    component: CardBuilder,
    requiredAuthLevel: Role.User,
  },
  {
    name: 'contact info',
    path: '/:username/:cardNameOrId?',
    component: ContactInfoPage,
  },
  {
    name: 'admin panel',
    path: '/admin',
    exact: false,
    component: AdminPanel,
    requiredAuthLevel: Role.Admin,
  },

  // 404 page
  {
    name: '404 page',
    component: FourOhFourPage,
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
