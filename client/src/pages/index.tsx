import * as React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import ProtectedRoute from 'src/components/ProtectedRoute'
import { AuthLevel } from 'src/config'
import AdminPanel from 'src/pages/AdminPanel'
import ComingSoonPage from 'src/pages/ComingSoonPage'
import ContactInfoPage from 'src/pages/ContactInfoPage'
import ContactSaver from 'src/pages/ContactSaver'
import ForgotPassword from 'src/pages/ForgotPassword'
import FourOhFourPage from 'src/pages/FourOhFourPage'
import LandingPage from 'src/pages/LandingPage'
import LinkerPage from 'src/pages/LinkerPage'
import LoadingPage from 'src/pages/LoadingPage'
import LoginPage from 'src/pages/LoginPage'
import ResetPassword from 'src/pages/ResetPassword'
import UserControlPanel from 'src/pages/UserControlPanel'
import { ensureActiveToken, Role } from 'src/utils/auth'
import FaqPage from 'src/pages/FaqPage'
import CardBuilder from 'src/pages/CardBuilder'
import ShopFront from 'src/pages/ShopFront'

interface RouteCommon {
  path: string | null // null to handle 404
  exact?: boolean // default is false
  exclude?: boolean
}
interface ComponentRouteType extends RouteCommon {
  requiredAuthLevel?: AuthLevel
  // Annotation for pages that are totally public and thus have no need for user to be authenticated (e.g. landing page)
  noLoginRequired?: boolean
  Component: (...args: any) => JSX.Element | null
}

interface RedirectRouteType extends RouteCommon {
  path: string
  redirect?: { to: string; type: 'internal' | 'external' }
}

type RouteType = ComponentRouteType | RedirectRouteType

const inProduction = process.env.NODE_ENV === 'production'

export const routes: Array<RouteType> = [
  {
    exact: true,
    path: '/',
    Component:
      // Show the ComingSoonPage unless we're looking at dev/staging and the showInProgress query param is provided
      process.env.NODE_ENV !== 'production' &&
      new URLSearchParams(window.location.search).get('showInProgress') != null
        ? LandingPage
        : ComingSoonPage,
    noLoginRequired: true,
  },
  {
    exact: true,
    path: '/login',
    Component: LoginPage,
  },
  {
    exact: true,
    path: '/register',
    Component: LoginPage,
  },
  {
    exact: true,
    path: '/forgot-password',
    Component: ForgotPassword,
  },
  {
    exact: true,
    path: '/reset-password',
    Component: ResetPassword,
  },
  {
    path: '/faq',
    exact: true,
    Component: FaqPage,
  },
  {
    path: '/about',
    exact: true,
    redirect: {
      to: 'https://www.notion.so/About-Us-34bb756e6b10412786a720cd9a081d1f',
      type: 'external',
    },
  },
  {
    path: '/terms-of-service',
    exact: true,
    redirect: {
      to:
        'https://www.notion.so/nomus/Terms-of-Service-da49ae4ac6554bc182f742a03c1000fd',
      type: 'external',
    },
  },
  {
    path: '/privacy-policy',
    exact: true,
    redirect: {
      to:
        'https://www.notion.so/nomus/Privacy-Policy-7fc0ed2852fe4d9d8f962d47ca0e5129',
      type: 'external',
    },
  },
  {
    path: '/instructional-card',
    exact: true,
    redirect: {
      to: '/faq',
      type: 'internal',
    },
  },
  {
    exact: true,
    path: '/loading',
    Component: () => <LoadingPage fullscreen />,
    exclude: inProduction,
  },
  {
    path: '/dashboard/contacts/save',
    Component: ContactSaver,
    requiredAuthLevel: Role.User,
  },
  {
    path: '/dashboard',
    Component: UserControlPanel,
    requiredAuthLevel: Role.User,
  },
  {
    path: '/shop',
    Component: ShopFront,
    exclude: inProduction,
  },
  {
    path: '/card-studio/:buildBaseType?',
    Component: CardBuilder,
    requiredAuthLevel: Role.User,
    exclude: inProduction,
  },
  {
    path: '/admin/linker/:routeStr',
    Component: LinkerPage,
    requiredAuthLevel: Role.PrintTech,
  },
  {
    path: '/admin',
    exact: false,
    Component: AdminPanel,
    requiredAuthLevel: Role.Admin,
  },

  {
    path: '/404',
    Component: FourOhFourPage,
  },
  // Has to be last so other routes can get accessed
  {
    path: '/:username',
    Component: ContactInfoPage,
  },
  // fallback to 404 page if nothing else matched, this is unlikely to ever be reached since the /:username route consumes ~everything but keeping it just in case
  {
    Component: FourOhFourPage,
    path: null,
  },
]

// A wrapper Component that triggers an access token refresh if necessary to make sure user has a non-expired access token
// We skip this for certain pages that we needn't attepmt a login check for, like the landing page
const AttemptLogin = ({ children }: any) => {
  const [attempted, setAttempted] = React.useState(false)
  React.useEffect(() => {
    // User may have gotten un-authed due to access token expiry, try refreshing once
    ensureActiveToken().then((result) => {
      setAttempted(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return attempted ? children : <LoadingPage fullscreen />
}

export const PageRouter = () => {
  return (
    <Router>
      <Switch>
        {routes
          .filter((route) => !route.exclude)
          .map((routeConfig) => {
            if ('redirect' in routeConfig && routeConfig.redirect) {
              const { redirect, path } = routeConfig
              return (
                <Route key={path} path={path}>
                  {() => {
                    switch (redirect.type) {
                      case 'internal':
                        return <Redirect to={redirect.to} />
                      case 'external':
                        window.location.replace(redirect.to)
                        return
                    }
                  }}
                </Route>
              )
            } else if ('Component' in routeConfig) {
              const {
                path,
                requiredAuthLevel,
                noLoginRequired,
                Component,
                ...rest
              } = routeConfig
              const componentToRender = noLoginRequired ? (
                <Component />
              ) : (
                <AttemptLogin>
                  <Component />
                </AttemptLogin>
              )

              const routeElement =
                requiredAuthLevel == null ? (
                  <Route key={path ?? '404'} path={path ?? undefined} {...rest}>
                    {componentToRender}
                  </Route>
                ) : (
                  <ProtectedRoute
                    key={path}
                    path={path ?? undefined}
                    requiredAuthLevel={requiredAuthLevel}
                    {...rest}
                  >
                    {componentToRender}
                  </ProtectedRoute>
                )
              return routeElement
            }
            return null
          })}
      </Switch>
    </Router>
  )
}

export default routes
