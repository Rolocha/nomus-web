import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory, useLocation } from 'react-router-dom'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Link from 'src/components/Link'
import PasswordVisibilityToggle from 'src/components/PasswordVisibilityToggle'
import * as Text from 'src/components/Text'
import { useAuth } from 'src/utils/auth'
import * as yup from 'yup'

interface LoginFormData {
  email: string
  password: string
}

type SubmissionErrorType = 'incorrect-credentials'

const renderSubmissionError = (type: SubmissionErrorType) => {
  return (
    <Text.Body3 color="brightCoral">
      {
        {
          'incorrect-credentials':
            'The username and password you entered did not match our records. Please double-check and try again.',
        }[type]
      }
    </Text.Body3>
  )
}

const LoginForm = () => {
  const { register, handleSubmit, errors } = useForm<LoginFormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email('Please enter a valid email address.')
          .required('Email is required.'),
        password: yup.string().required('Password is required.'),
      }),
    ),
  })
  const { logIn, loggedIn } = useAuth()

  const history = useHistory()
  const location = useLocation<{ from: Location }>()
  const searchParams = React.useMemo(
    () => new URLSearchParams(location.search),
    [location],
  )

  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const [loggingIn, setLoggingIn] = React.useState(false)
  const [
    submissionError,
    setSubmissionError,
  ] = React.useState<SubmissionErrorType | null>(null)

  const onSubmit = async (formData: LoginFormData) => {
    setSubmissionError(null)
    setLoggingIn(true)
    try {
      const authResponse = await logIn(formData)
      if (authResponse.error) {
        setSubmissionError(authResponse.error.code as SubmissionErrorType)
      }
    } finally {
      setLoggingIn(false)
    }
  }

  // Redirect to the redirect_uri once the user is logged in
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
    <Box display="flex" flexDirection="column" mt={4}>
      <Text.BrandHeader>Sign In</Text.BrandHeader>
      <Form.Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Item mb="20px">
          <Form.Label htmlFor="email">EMAIL</Form.Label>
          <Form.Input
            name="email"
            ref={register({ required: true })}
            type="text"
            autoComplete="email"
            error={errors.email}
          />
          <Form.FieldError fieldError={errors.email} />
        </Form.Item>
        <Form.Item mb="20px">
          <Box display="flex" justifyContent="space-between">
            <Form.Label htmlFor="password">PASSWORD</Form.Label>
            <PasswordVisibilityToggle
              visible={passwordVisible}
              setVisible={setPasswordVisible}
            />
          </Box>
          <Form.Input
            name="password"
            ref={register({ required: true })}
            type={passwordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            error={errors.password}
            autoCorrect="off"
            autoCapitalize="off"
          />
          <Text.Body3>
            <Link to="/forgot-password">Forgot your password?</Link>
          </Text.Body3>
          <Form.FieldError fieldError={errors.password} />
        </Form.Item>
        <Button
          type="submit"
          width="100%"
          variant="primary"
          size="big"
          isLoading={loggingIn}
          loadingText="Logging in"
        >
          Continue
        </Button>
        {submissionError && (
          <Box my={2}>{renderSubmissionError(submissionError)}</Box>
        )}
      </Form.Form>
      <Text.Body2 mt={3}>
        Don't have an account yet?{' '}
        <Link to={`/register?${searchParams.toString()}`}>Get started.</Link>
      </Text.Body2>
    </Box>
  )
}

export default LoginForm
