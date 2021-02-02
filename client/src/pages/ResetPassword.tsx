import { css } from '@emotion/react'
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
import * as Text from 'src/components/Text'
import * as yup from 'yup'

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

const ResetPassword = () => {
  const { register, handleSubmit, errors, formState, watch } = useForm<
    ResetPasswordFormData
  >({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        password: yup.string().required('Password is required.'),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], "Passwords don't match."),
      }),
    ),
    defaultValues: {
      password: '',
    },
  })

  const location = useLocation()
  const history = useHistory()
  const queryParams = new URLSearchParams(location.search)
  const { token, userId } = React.useMemo(
    () => ({
      token: queryParams.get('token'),
      userId: queryParams.get('userId'),
    }),
    [queryParams],
  )

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
        token: queryParams.get('token'),
        userId: queryParams.get('userId'),
        newPassword: formData.password,
      },
    })
  }

  React.useEffect(() => {
    if (token == null || userId == null) {
      // Malformed URL, this page won't work for them, redirect
      history.push('/forgot-password')
    }
  }, [token, userId, history])

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
          <Logo css={css({ marginBottom: '32px' })} />
        </Link>
        <Text.PageHeader>Reset your password</Text.PageHeader>

        {formState.isSubmitSuccessful ? (
          <Box mt={4}>
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
                />
                <PasswordStrengthIndicator password={watch('password')} />
                <Form.FieldError fieldError={errors.password} />
              </Form.Item>
              <Form.Item mb="20px">
                <Form.Label htmlFor="email">Confirm new password</Form.Label>
                <Form.Input
                  name="confirmPassword"
                  ref={register({ required: true })}
                  type={passwordVisible ? 'text' : 'password'}
                  error={errors.confirmPassword}
                />
                <Form.FieldError fieldError={errors.confirmPassword} />
              </Form.Item>
              <Button
                type="submit"
                width="100%"
                variant="primary"
                size="big"
                inProgress={formState.isSubmitting}
              >
                Update password
              </Button>
            </Form.Form>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ResetPassword
