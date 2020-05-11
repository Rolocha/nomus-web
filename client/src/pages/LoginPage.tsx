import * as React from 'react'
import { css } from '@emotion/core'
import { useHistory, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { useAuth } from 'src/utils/auth'
import { Body, Link } from 'src/components/Text'
import Container from 'src/components/Container'
import Button from 'src/components/Button'
import Box from 'src/components/Box'
import * as Form from 'src/components/Form'
import Logo from 'src/components/Logo'
import { LoginSquiggle } from 'src/components/SVG'

interface LoginFormData {
  email: string
  password: string
}

interface SignupFormData extends LoginFormData {
  firstName: string
  middleName?: string | null
  lastName: string
}

type FormData = LoginFormData | SignupFormData

const showRequiredError = (
  fieldKey: string,
  fieldName: string,
  errors: Record<string, any>,
) =>
  fieldKey in errors && errors[fieldKey] ? (
    <Body color="terraCotta" m={1}>
      {`${fieldName} is required`}
    </Body>
  ) : null

const LoginPage = () => {
  const [mode, setMode] = React.useState<'login' | 'signup'>('login')
  const { loggedIn, logIn, signUp } = useAuth()
  const history = useHistory()
  const location = useLocation<{ from: Location }>()
  const { register, handleSubmit, errors } = useForm<FormData>()

  if (loggedIn) {
    // Redirect user to where they came from or, by default, /dashboard
    history.replace(location.state?.from ?? { pathname: '/dashboard' })
    return null
  }

  const onSubmit = (formData: FormData) => {
    switch (mode) {
      case 'login':
        logIn(formData as LoginFormData)
        break
      case 'signup':
        signUp(formData as SignupFormData)
        break
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
          <Form.Form onSubmit={handleSubmit(onSubmit)}>
            {mode === 'signup' && [
              <Box key="first" mb="20px">
                <Form.Input
                  required
                  name="firstName"
                  label="First name"
                  ref={register({ required: true })}
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                />
                {showRequiredError('firstName', 'First name', errors)}
              </Box>,
              <Box key="middle" mb="20px">
                <Form.Input
                  required
                  name="middleName"
                  label="Middle Name"
                  ref={register({ required: false })}
                  type="text"
                  placeholder="David"
                  autoComplete="additional-name"
                />
              </Box>,
              <Box key="last" mb="20px">
                <Form.Input
                  required
                  name="lastName"
                  label="Last name"
                  ref={register({ required: true })}
                  type="text"
                  placeholder="Appleseed"
                  autoComplete="family-name"
                />
                {showRequiredError('lastName', 'Last name', errors)}
              </Box>,
            ]}
            <Box mb="20px">
              <Form.Input
                name="email"
                label="Email"
                ref={register({ required: true })}
                type="text"
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {showRequiredError('email', 'Email', errors)}
            </Box>
            <Box mb="20px">
              <Form.Input
                name="password"
                label="Password"
                ref={register({ required: true })}
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {showRequiredError('password', 'Password', errors)}
            </Box>
          </Form.Form>
        </Box>
        <Box
          mt="10px"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Button
            type="submit"
            variant="primary"
            width="full"
            onClick={handleSubmit(onSubmit)}
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
