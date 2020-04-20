import * as React from 'react'
import { css } from '@emotion/core'
import { useHistory } from 'react-router-dom'

import { useLazyQuery, useMutation, gql } from 'apollo'
import { AUTH_TOKEN_KEY } from 'config'
import { Body, Link } from 'components/Text'
import Container from 'components/Container'
import Button from 'components/Button'
import Box from 'components/Box'
import Input from 'components/Form/Input'
import Logo from 'components/Logo'
import { LoginSquiggle } from 'components/SVG'

interface LogInResponse {
  login: {
    token: string
  }
}

interface SignUpResponse {
  signup: {
    token: string
    // TODO: need better model typing soon
    user: any
  }
}

const LoginPage = () => {
  const [mode, setMode] = React.useState<'login' | 'signup'>('login')
  const [email, setEmail] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const history = useHistory()

  const [logIn, logInReqMeta] = useLazyQuery<LogInResponse>(
    gql`
      query login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
    `,
  )

  const [signUp, signUpReqMeta] = useMutation<SignUpResponse>(
    gql`
      mutation signup($data: SignupInput!) {
        signup(data: $data) {
          token
        }
      }
    `,
  )

  const handleSuccess = (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    history.push('/profile')
  }

  // Handle a completed log-in flow
  if (logInReqMeta.called && !logInReqMeta.loading) {
    if (logInReqMeta.data) {
      handleSuccess(logInReqMeta.data.login.token)
    }
  }

  // Handle a completed sign-up flow
  if (signUpReqMeta.called && !signUpReqMeta.loading) {
    if (signUpReqMeta.data) {
      handleSuccess(signUpReqMeta.data.signup.token)
    }
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
            <Box mb="20px">
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
            <Box mb="20px">
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
                login: () => logIn({ variables: { email, password } }),
                signup: () =>
                  signUp({
                    variables: {
                      data: { email, password, firstName, lastName },
                    },
                  }),
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
            <Body>or</Body>,
            <Button
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
