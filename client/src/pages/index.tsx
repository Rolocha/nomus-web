import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ProtectedRoute from 'src/components/ProtectedRoute'
import { AuthLevel } from 'src/config'
import AdminPanel from 'src/pages/AdminPanel'
import ContactInfoPage from 'src/pages/ContactInfoPage'
import ContactSaver from 'src/pages/ContactSaver'
import FourOhFourPage from 'src/pages/FourOhFour'
import LandingPage from 'src/pages/LandingPage'
import LoadingPage from 'src/pages/LoadingPage'
import LoginPage from 'src/pages/LoginPage'
import UserControlPanel from 'src/pages/UserControlPanel'
import { ensureActiveToken, Role } from 'src/utils/auth'
import ComingSoonPage from './ComingSoonPage'

interface PageType {
  name: string
  path?: string
  exact?: boolean // default is false
  Component: (...args: any) => JSX.Element | null
  requiredAuthLevel?: AuthLevel
  // Annotation for pages that are totally public and thus have no need for user to be authenticated (e.g. landing page)
  noLoginRequired?: boolean
}

export const pages: Array<PageType> = [
  {
    name: 'landing',
    exact: true,
    path: '/',
    Component:
      // Show the ComingSoonPage in production but the (in-progress) LandingPage otherwise (unless URL param ?viewAsProd provided)
      process.env.NODE_ENV === 'production' ||
      new URLSearchParams(window.location.search).get('viewAsProd') != null
        ? ComingSoonPage
        : LandingPage,
    noLoginRequired: true,
  },
  {
    name: 'login',
    exact: true,
    path: '/login',
    Component: LoginPage,
  },
  {
    name: 'register',
    exact: true,
    path: '/register',
    Component: LoginPage,
  },
  // {
  //   name: 'shop front',
  //   exact: true,
  //   path: '/shop',
  //   Component: ShopFront,
  // },
  {
    name: 'dashboard',
    path: '/dashboard/contacts/save',
    Component: ContactSaver,
    requiredAuthLevel: Role.User,
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    Component: UserControlPanel,
    requiredAuthLevel: Role.User,
  },
  // {
  //   name: 'card studio',
  //   path: '/card-studio/:buildBaseType?',
  //   Component: CardBuilder,
  //   requiredAuthLevel: Role.User,
  // },
  {
    name: 'admin panel',
    path: '/admin',
    exact: false,
    Component: AdminPanel,
    requiredAuthLevel: Role.Admin,
  },
  // Has to be last so other routes can get accessed
  {
    name: 'contact info',
    path: '/:username',
    Component: ContactInfoPage,
  },

  // 404 page
  {
    name: '404 page',
    Component: FourOhFourPage,
  },
]

// A wrapper Component that triggers an access token refresh if necessary to make sure user has a non-expired access token
// TODO: A future optimization would be to avoid wrapping with this for certain public-only routes like the landing page
const AttemptLogin = ({ children }: any) => {
  const [attempted, setAttempted] = React.useState(false)
  React.useEffect(() => {
    // User may have gotten un-authed due to access token expiry, try refreshing once
    ensureActiveToken().then((result) => {
      setAttempted(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return attempted ? children : <LoadingPage />
}

export const PageRouter = () => {
  return (
    <Router>
      <Switch>
        {pages.map(
          ({
            name,
            requiredAuthLevel,
            noLoginRequired,
            Component,
            ...rest
          }) => {
            const componentToRender = noLoginRequired ? (
              <Component />
            ) : (
              <AttemptLogin>
                <Component />
              </AttemptLogin>
            )

            const routeElement =
              requiredAuthLevel == null ? (
                <Route key={name} {...rest}>
                  {componentToRender}
                </Route>
              ) : (
                <ProtectedRoute
                  key={name}
                  requiredAuthLevel={requiredAuthLevel}
                  {...rest}
                >
                  {componentToRender}
                </ProtectedRoute>
              )
            return routeElement
          },
        )}
      </Switch>
    </Router>
  )
}

export default pages
