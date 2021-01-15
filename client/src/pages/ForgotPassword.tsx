import { yupResolver } from '@hookform/resolvers/yup'
import gql from 'graphql-tag'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'src/apollo'
import { SendPasswordResetEmailMutation } from 'src/apollo/types/SendPasswordResetEmailMutation'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import * as Text from 'src/components/Text'
import * as yup from 'yup'

interface ForgotPasswordFormData {
  email: string
}

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
    clearErrors,
  } = useForm<ForgotPasswordFormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email('Please enter a valid email address.')
          .required('Email is required.'),
      }),
    ),
  })

  const [sendPasswordResetEmail] = useMutation<SendPasswordResetEmailMutation>(
    gql`
      mutation SendPasswordResetEmailMutation($email: String!) {
        sendPasswordResetEmail(email: $email)
      }
    `,
    { errorPolicy: 'all' },
  )

  const onSubmit = async (formData: ForgotPasswordFormData) => {
    const result = await sendPasswordResetEmail({
      variables: {
        email: formData.email,
      },
    })

    if (result.errors) {
      if (
        result.errors.some((err) => err.message === 'no-user-with-that-email')
      ) {
        setError('email', {
          message: "We couldn't find a user with email address.",
          type: 'server',
        })
      } else {
        setError('email', {
          message: 'Uh oh, something went wrong. Please try again later.',
          type: 'server',
        })
      }
    } else {
      clearErrors()
    }
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
        <Text.BrandHeader>Forgot your password?</Text.BrandHeader>
        <Text.Body2>
          Enter your email address and we'll send you a link to reset your
          password.
        </Text.Body2>
        <Box mt={4}>
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

            {formState.isSubmitSuccessful ? (
              <Text.Body2>
                Sent! Check your inbox for the reset password link.
              </Text.Body2>
            ) : (
              <Button type="submit" width="100%" variant="primary" size="big">
                Continue
              </Button>
            )}
          </Form.Form>
        </Box>
      </Box>
    </Box>
  )
}

export default ForgotPassword
