import * as React from 'react'
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom'

import { AuthLevel } from 'config'
import { Role } from 'utils/auth'
import ProtectedRoute from 'components/ProtectedRoute'

import LandingPage from 'pages/LandingPage'
import ProfilePage from 'pages/ProfilePage'
import LoginPage from 'pages/LoginPage'
import ContactInfoPage from 'pages/ContactInfoPage'
import AdminPanel from 'pages/AdminPanel'

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
    name: 'profile',
    exact: true,
    path: '/profile',
    component: ProfilePage,
    requiredAuthLevel: Role.User,
  },
  {
    name: 'contact info',
    path: '/u/:username/:cardNameOrId?',
    component: ContactInfoPage,
  },
  {
    name: 'admin panel',
    path: '/admin',
    exact: false,
    component: AdminPanel,
    requiredAuthLevel: Role.Admin,
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
