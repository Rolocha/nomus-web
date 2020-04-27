import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'

import { AuthLevel } from 'src/config'
import { useAuth } from 'src/utils/auth'

interface Props {
  component: React.ElementType<any>
  requiredAuthLevel: AuthLevel
  exact?: boolean
  path: string
}

const ProtectedRoute = ({
  requiredAuthLevel,
  component: ProtectedComponent,
  ...rest
}: Props) => {
  const { loggedIn, userRoles } = useAuth()
  const location = useLocation()

  return (
    <Route
      {...rest}
      render={(props) => {
        // User isn't logged in so we don't know yet if they can access this route
        if (loggedIn === false) {
          return (
            <Redirect to={{ pathname: '/login', state: { from: location } }} />
          )
        }

        // Still waiting to find out the user's roles
        if (userRoles == null) {
          return null
        }
        // Unauthorized access (user is logged in but lacks permissions to access this route)
        if (
          requiredAuthLevel != null &&
          userRoles.includes(requiredAuthLevel) === false
        ) {
          return <Redirect to="/" />
        }

        return <ProtectedComponent {...props} />
      }}
    />
  )
}

export default ProtectedRoute
