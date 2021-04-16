import { yupResolver } from '@hookform/resolvers/yup'
import gql from 'graphql-tag'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory, useLocation } from 'react-router-dom'
import { useMutation } from 'src/apollo'
import { ResetPasswordMutation } from 'src/apollo/types/ResetPasswordMutation'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Link from 'src/components/Link'
import Logo from 'src/components/Logo'
import PasswordStrengthIndicator from 'src/components/PasswordStrengthIndicator'
import PasswordVisibilityToggle from 'src/components/PasswordVisibilityToggle'
import Spinner from 'src/components/Spinner'
import * as Text from 'src/components/Text'
import * as yup from 'yup'
import { useResetLinkValidation } from './useResetLinkValidation'

interface ResetPasswordFormData {
  password: string
}

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    watch,
  } = useForm<ResetPasswordFormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        password: yup.string().required('Password is required.'),
      }),
    ),
    defaultValues: {
      password: '',
    },
  })

  const location = useLocation()
  const history = useHistory()
  const queryParams = React.useMemo(() => {
    const _params = new URLSearchParams(location.search)
    return {
      token: _params.get('token'),
      userId: _params.get('userId'),
    }
  }, [location.search])

  const resetLinkValidity = useResetLinkValidation(queryParams)

  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const [resetPassword] = useMutation<ResetPasswordMutation>(
    gql`
      mutation ResetPasswordMutation(
        $token: String!
        $newPassword: String!
        $userId: String!
      ) {
        resetPassword(token: $token, newPassword: $newPassword, userId: $userId)
      }
    `,
    { errorPolicy: 'all' },
  )

  const onSubmit = async (formData: ResetPasswordFormData) => {
    await resetPassword({
      variables: {
        token: queryParams.token,
        userId: queryParams.userId,
        newPassword: formData.password,
      },
    })
  }

  if (resetLinkValidity === 'invalid') {
    history.push('/forgot-password')
    return null
  }

  return (
    <Box
      container
      display="flex"
      justifyContent="center"
      bg="white"
      position="relative"
    >
      <Box display="flex" flexDirection="column" mt={4}>
        <Link to="/">
          <Logo mb="32px" />
        </Link>
        <Text.PageHeader>Reset your password</Text.PageHeader>

        {resetLinkValidity == null && (
          <Box mt={3}>
            <Spinner />
          </Box>
        )}

        {resetLinkValidity === 'expired' && (
          <Box mt={3}>
            <Text.Body2>
              Uh oh... looks like this reset password link has expired.
            </Text.Body2>
            <Link
              mt={2}
              buttonStyle="primary"
              buttonSize="big"
              to="/forgot-password"
            >
              Send a new one
            </Link>
          </Box>
        )}

        {resetLinkValidity === 'valid' &&
          (formState.isSubmitSuccessful ? (
            <Box mt={3}>
              <Text.Body2>
                You're all set! You can now <Link to="/login">log in</Link> with
                your new password.
              </Text.Body2>
            </Box>
          ) : (
            <Box>
              <Text.Body2 mb={4}>
                Almost there. Just choose a new password.
              </Text.Body2>
              <Form.Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Item mb="20px">
                  <Box display="flex" justifyContent="space-between">
                    <Form.Label htmlFor="password">New password</Form.Label>
                    <PasswordVisibilityToggle
                      visible={passwordVisible}
                      setVisible={setPasswordVisible}
                    />
                  </Box>
                  <Form.Input
                    name="password"
                    ref={register({ required: true })}
                    type={passwordVisible ? 'text' : 'password'}
                    error={errors.password}
                    autoCorrect="off"
                    autoCapitalize="off"
                    autoComplete="off"
                  />
                  <PasswordStrengthIndicator password={watch('password')} />
                  <Form.FieldError fieldError={errors.password} />
                </Form.Item>
                <Button
                  type="submit"
                  width="100%"
                  variant="primary"
                  size="big"
                  isLoading={formState.isSubmitting}
                >
                  Update password
                </Button>
              </Form.Form>
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default ResetPassword
