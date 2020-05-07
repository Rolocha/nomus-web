import * as React from 'react'
import { css } from '@emotion/core'
import { useHistory, useLocation } from 'react-router-dom'

import { useAuth } from 'src/utils/auth'
import { Body, Link } from 'src/components/Text'
import Container from 'src/components/Container'
import Button from 'src/components/Button'
import Box from 'src/components/Box'
import Input from 'src/components/Form/Input'
import Logo from 'src/components/Logo'
import { LoginSquiggle } from 'src/components/SVG'

const LoginPage = () => {
  const [mode, setMode] = React.useState<'login' | 'signup'>('login')
  const [email, setEmail] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { loggedIn, logIn, signUp } = useAuth()
  const history = useHistory()
  const location = useLocation<{ from: Location }>()

  if (loggedIn) {
    // Redirect user to where they came from or, by default, /dashboard
    history.replace(location.state?.from ?? { pathname: '/dashboard' })
    return null
  }

  return (
    <Container
      display="flex"
      justifyContent="center"
      minHeight="100vh"
      bg="white"
      position="relative"
    >
      <Box position="absolute" right="0" bottom="0" height="50%">
        <LoginSquiggle
          css={css`
            height: 100%;
          `}
        />
      </Box>
      <Box
        position="relative"
        mt="100px"
        maxWidth="400px"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
      >
        <Logo
          css={css`
            min-width: 300px;
            max-width: 75%;
          `}
        />
        <Body fontWeight="bold" mb="0">
          Tap. Connect. Network with purpose.
        </Body>
        <Body mt="0">
          Sign in to manage your connections and build your digital presence.
        </Body>

        <Box display="flex" flexDirection="column">
          {mode === 'signup' && [
            <Box key="first" mb="20px">
              <Input
                required
                name="firstName"
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="John"
              />
            </Box>,
            <Box key="last" mb="20px">
              <Input
                required
                name="lastName"
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Appleseed"
              />
            </Box>,
          ]}
          <Box mb="20px">
            <Input
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Enter your email address"
            />
          </Box>
          <Box mb="20px">
            <Input
              name="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
            />
          </Box>
        </Box>
        <Box
          mt="10px"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Button
            variant="blue"
            width="full"
            onClick={
              {
                login: () => logIn({ email, password }),
                signup: () => signUp({ email, password, firstName, lastName }),
              }[mode]
            }
          >
            {
              {
                login: 'Sign in',
                signup: 'Create account',
              }[mode]
            }
          </Button>
          <Link
            mt={1}
            onClick={
              {
                login: () => history.push('/forgot-password'),
                signup: () => setMode('login'),
              }[mode]
            }
          >
            {
              {
                login: "Can't sign in? Let us help.",
                signup: 'Already have an account? Sign in.',
              }[mode]
            }
          </Link>
          {mode === 'login' && [
            <Body key="body">or</Body>,
            <Button
              key="button"
              width="full"
              variant="primary"
              onClick={() => setMode('signup')}
            >
              Create an account
            </Button>,
          ]}
        </Box>
      </Box>
    </Container>
  )
}

export default LoginPage
