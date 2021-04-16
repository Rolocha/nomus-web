import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory, useLocation } from 'react-router-dom'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Link from 'src/components/Link'
import PasswordStrengthIndicator from 'src/components/PasswordStrengthIndicator'
import PasswordVisibilityToggle from 'src/components/PasswordVisibilityToggle'
import * as Text from 'src/components/Text'
import { useAuth } from 'src/utils/auth'
import { validatePassword } from 'src/utils/password'
import * as yup from 'yup'

interface RegistrationFormData {
  email: string
  password: string
  firstName: string
  middleName?: string | null
  lastName: string
}

type SubmissionErrorType = 'invalid-email' | 'account-already-exists'

const renderSubmissionError = (type: SubmissionErrorType) => {
  return (
    <Text.Body3 color="brightCoral">
      {
        {
          // This case should pretty much never be reached since we do client-side regex email validation too.
          'invalid-email':
            'The email address you entered is invalid. Please use a valid email address.',
          'account-already-exists':
            'An account with that email address already exists.',
        }[type]
      }
    </Text.Body3>
  )
}

const RegistrationForm = () => {
  const [resentEmailSuccessfully, setResentEmailSuccessfully] = React.useState<
    null | boolean
  >(null)

  const {
    register,
    handleSubmit,
    formState,
    errors,
    watch,
  } = useForm<RegistrationFormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        firstName: yup.string().required('First name is required.'),
        middleName: yup.string(),
        lastName: yup.string().required('Last name is required.'),
        email: yup
          .string()
          .email('Please enter a valid email address.')
          .required('Email is required.'),
        password: yup
          .string()
          .required('Password is required.')
          .test(
            'is-secure',
            'Your password is too weak. Please use a stronger password.',
            validatePassword,
          ),
      }),
    ),
    defaultValues: {
      password: '',
    },
  })
  const { loggedIn, signUp } = useAuth()

  const history = useHistory()
  const location = useLocation<{ from: Location }>()
  const searchParams = React.useMemo(
    () => new URLSearchParams(location.search),
    [location],
  )

  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const [submittingForm, setSubmittingForm] = React.useState(false)
  const [
    submissionError,
    setSubmissionError,
  ] = React.useState<SubmissionErrorType | null>(null)

  const onSubmit = async (formData: RegistrationFormData) => {
    setSubmissionError(null)
    setSubmittingForm(true)
    try {
      const authResponse = await signUp(formData)
      if (authResponse.error) {
        setSubmissionError(authResponse.error.code as SubmissionErrorType)
      }
    } finally {
      setSubmittingForm(false)
    }
  }

  const handleResendEmail = async () => {
    const result = await fetch('/auth/resend-verification-email')
    setResentEmailSuccessfully(result.ok)
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
      <Text.BrandHeader>
        {formState.isSubmitSuccessful ? 'Thank you!' : 'Get started'}
      </Text.BrandHeader>
      {formState.isSubmitSuccessful ? (
        <>
          <Box mt={3}>
            <Text.Body2 mb={3}>
              We sent an email to your inbox to make sure we’ve got it right.
              Pretty please, click the link in your email to confirm your email
              address.
            </Text.Body2>

            {resentEmailSuccessfully === null && (
              <Text.Body2>
                Didn’t get an email?{' '}
                <Button cursor="pointer" onClick={handleResendEmail}>
                  Resend the magic link.
                </Button>{' '}
                Oooh.
              </Text.Body2>
            )}

            {resentEmailSuccessfully === false && (
              <Text.Body2>
                Uh oh, there was a problem with resending your magic link.
                Please try again later.
              </Text.Body2>
            )}

            {resentEmailSuccessfully === true && (
              <Text.Body2>
                We sent a new magic link to your inbox. Please click it to
                finish verifying your email.
              </Text.Body2>
            )}
          </Box>
          <Link mt={3} to="/dashboard" buttonStyle="primary" buttonSize="big">
            Continue to your dashboard
          </Link>
        </>
      ) : (
        <>
          <Form.Form onSubmit={handleSubmit(onSubmit)}>
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gridColumnGap="16px"
            >
              <Form.Item mb="20px">
                <Form.Label htmlFor="email">FIRST NAME</Form.Label>
                <Form.Input
                  name="firstName"
                  ref={register({ required: true })}
                  type="text"
                  autoComplete="firstName"
                  error={errors.firstName}
                />
                <Form.FieldError fieldError={errors.firstName} />
              </Form.Item>
              <Form.Item mb="20px">
                <Form.Label htmlFor="email">LAST NAME</Form.Label>
                <Form.Input
                  name="lastName"
                  ref={register({ required: true })}
                  type="text"
                  autoComplete="lastName"
                  error={errors.lastName}
                />
                <Form.FieldError fieldError={errors.lastName} />
              </Form.Item>
            </Box>
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
                ref={register({
                  required: true,
                })}
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                error={errors.password}
                autoCorrect="off"
                autoCapitalize="off"
              />
              <PasswordStrengthIndicator password={watch('password')} />
              <Form.FieldError fieldError={errors.password} />
            </Form.Item>
            <Button
              variant="primary"
              size="big"
              isLoading={submittingForm}
              loadingText="Creating your account"
              type="submit"
              width="100%"
            >
              Create free account
            </Button>
            {submissionError && (
              <Box my={2}>{renderSubmissionError(submissionError)}</Box>
            )}
          </Form.Form>
          <Text.Body2 textAlign="center" mt={2}>
            By clicking Create free account, you agree to our{' '}
            <Link to="terms-of-service">Terms of Service</Link> and{' '}
            <Link to="privacy-policy">Privacy Policy</Link>.
          </Text.Body2>
          <Text.Body2 mt={3}>
            Have an account?{' '}
            <Link to={`/login?${searchParams.toString()}`}>Sign in.</Link>
          </Text.Body2>
        </>
      )}
    </Box>
  )
}

export default RegistrationForm
