import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { useAuth } from 'src/utils/auth'
import * as yup from 'yup'

interface LoginFormData {
  email: string
  password: string
}

const showRequiredError = (
  fieldKey: string,
  fieldName: string,
  errors: Record<string, any>,
) =>
  fieldKey in errors && errors[fieldKey] ? (
    <Text.Body3 color="brightCoral" m={1}>
      {`${fieldName} is required`}
    </Text.Body3>
  ) : null

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
  const { register, handleSubmit, formState, errors } = useForm<LoginFormData>({
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required(),
      }),
    ),
  })
  const { logIn } = useAuth()
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

  return (
    <Box display="flex" flexDirection="column" mt={4}>
      <Form.Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Item mb="20px">
          <Form.Label htmlFor="email">EMAIL</Form.Label>
          <Form.Input
            name="email"
            ref={register({ required: true })}
            type="text"
            autoComplete="email"
          />
          {showRequiredError('email', 'Email', errors)}
        </Form.Item>
        <Form.Item mb="20px">
          <Box display="flex" justifyContent="space-between">
            <Form.Label htmlFor="password">PASSWORD</Form.Label>
            <Box
              role="button"
              cursor="pointer"
              display="flex"
              alignItems="center"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              <SVG.Eye color={colors.nomusBlue} />{' '}
              <Text.Body3 color="nomusBlue" ml={1} fontWeight={500}>
                {passwordVisible ? 'Hide' : 'Show'} password
              </Text.Body3>
            </Box>
          </Box>
          <Form.Input
            name="password"
            ref={register({ required: true })}
            type={passwordVisible ? 'text' : 'password'}
            autoComplete="current-password"
          />
          {showRequiredError('password', 'Password', errors)}
        </Form.Item>
        <Button
          type="submit"
          width="100%"
          variant="primary"
          size="big"
          inProgress={loggingIn}
          inProgressText="Logging in"
          disabled={!formState.isValid}
        >
          Continue
        </Button>
        {submissionError && (
          <Box my={2}>{renderSubmissionError(submissionError)}</Box>
        )}
      </Form.Form>
    </Box>
  )
}

export default LoginForm
