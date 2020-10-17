import { css } from '@emotion/core'
import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import Link from 'src/components/Link'
import * as Text from 'src/components/Text'
import { useAuth } from 'src/utils/auth'
import illustration from './login-illustration.svg'
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'

const bp = 'lg'

const LoginPage = () => {
  const { loggedIn } = useAuth()
  const history = useHistory()
  const location = useLocation<{ from: Location }>()

  const searchParams = React.useMemo(
    () => new URLSearchParams(location.search),
    [location],
  )

  // Guaranteed to be either register or login since those are the only routes this page should be rendered for
  const mode = location.pathname.substr(1) as 'register' | 'login'

  if (loggedIn) {
    const redirectUrl = searchParams.get('redirect_url')
    const nextUrl = redirectUrl ?? location.state?.from.pathname ?? '/dashboard'
    if (nextUrl.startsWith('/')) {
      history.replace(nextUrl)
    } else {
      // If the URL doesn't start with /, it's probably a different domain
      // in which case we have to use window.location's .replace() instead of history's
      window.location.replace(nextUrl)
    }
    return null
  }

  return (
    <Box
      container
      display="flex"
      justifyContent="center"
      minHeight="100vh"
      bg="white"
      position="relative"
    >
      <Box
        // Don't show the squiggle thing in mobile
        display={{ _: 'none', [bp]: 'block' }}
        position="absolute"
        zIndex={0}
        right="0"
        top="-5%"
        height="110vh"
        width="60vw"
      >
        <Image
          src={illustration}
          w="100%"
          h="100%"
          css={css({ objectFit: 'cover', objectPosition: 'left' })}
        />
      </Box>
      <Box
        position="relative"
        zIndex={1}
        display="grid"
        gridTemplateColumns={{ _: '', [bp]: '1fr 4fr 2fr 5fr' }}
        pt="110px"
      >
        {/* Left-hand side */}
        <Box gridColumn="2/3">
          <Text.PageHeader>
            {{ login: 'Sign in', register: 'Get started' }[mode]}
          </Text.PageHeader>
          <Box>
            {
              {
                login: <LoginForm />,
                register: <RegistrationForm />,
              }[mode]
            }
          </Box>
          {
            {
              login: (
                <Text.Body2>
                  Don't have an account yet?{' '}
                  <Link to={`/register?${searchParams.toString()}`}>
                    Get started.
                  </Link>
                </Text.Body2>
              ),
              register: (
                <Text.Body2>
                  Have an account?{' '}
                  <Link to={`/login?${searchParams.toString()}`}>Sign in.</Link>
                </Text.Body2>
              ),
            }[mode]
          }
        </Box>

        {/* Right-hand side */}
        <Box
          position="relative"
          display={{ _: 'none', [bp]: 'block' }}
          gridColumn="4/5"
        >
          TODO: Right hand side
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage