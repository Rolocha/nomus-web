import { yupResolver } from '@hookform/resolvers/yup'
import gql from 'graphql-tag'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { useMutation } from 'src/apollo'
import { ResetPasswordMutation } from 'src/apollo/types/ResetPasswordMutation'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import * as yup from 'yup'
import { colors } from 'src/styles'
import Logo from 'src/components/Logo'
import { css } from '@emotion/core'
import Link from 'src/components/Link'

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
    clearErrors,
  } = useForm<ResetPasswordFormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        password: yup.string().required('Password is required.'),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], "Passwords don't match."),
      }),
    ),
  })

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

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
    const result = await resetPassword({
      variables: {
        token: queryParams.get('token'),
        userId: queryParams.get('userId'),
        newPassword: formData.password,
      },
    })
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
        <Logo css={css({ marginBottom: '32px' })} />
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
                  error={errors.password}
                />
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
              <Button type="submit" width="100%" variant="primary" size="big">
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
