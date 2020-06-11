import { css } from '@emotion/core'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory, useLocation } from 'react-router-dom'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Logo from 'src/components/Logo'
import { LoginSquiggle } from 'src/components/SVG'
import { Body } from 'src/components/Text'
import { useAuth } from 'src/utils/auth'

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
    <Body color="brightCoral" m={1}>
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
    <Box
      container
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

        <Box display="flex" flexDirection="column" mt={4}>
          <Form.Form onSubmit={handleSubmit(onSubmit)}>
            {mode === 'signup' && [
              <Form.Item key="first" mb="20px">
                <Form.Label htmlFor="firstName">FIRST NAME</Form.Label>
                <Form.Input
                  required
                  name="firstName"
                  ref={register({ required: true })}
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                />
                {showRequiredError('firstName', 'First name', errors)}
              </Form.Item>,
              <Form.Item key="middle" mb="20px">
                <Form.Label htmlFor="middleName">MIDDLE NAME</Form.Label>
                <Form.Input
                  required
                  name="middleName"
                  ref={register({ required: false })}
                  type="text"
                  placeholder="David"
                  autoComplete="additional-name"
                />
              </Form.Item>,
              <Form.Item key="last" mb="20px">
                <Form.Label htmlFor="lastName">LAST NAME</Form.Label>
                <Form.Input
                  required
                  name="lastName"
                  ref={register({ required: true })}
                  type="text"
                  placeholder="Appleseed"
                  autoComplete="family-name"
                />
                {showRequiredError('lastName', 'Last name', errors)}
              </Form.Item>,
            ]}
            <Form.Item mb="20px">
              <Form.Label htmlFor="email">EMAIL</Form.Label>
              <Form.Input
                name="email"
                ref={register({ required: true })}
                type="text"
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {showRequiredError('email', 'Email', errors)}
            </Form.Item>
            <Form.Item mb="20px">
              <Form.Label htmlFor="password">PASSWORD</Form.Label>
              <Form.Input
                name="password"
                ref={register({ required: true })}
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {showRequiredError('password', 'Password', errors)}
            </Form.Item>
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
          <Button
            variant="tertiary"
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
          </Button>
          {mode === 'login' && [
            <Body key="body">or</Body>,
            <Button
              key="button"
              width="full"
              variant="secondary"
              onClick={() => setMode('signup')}
            >
              Create an account
            </Button>,
          ]}
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
