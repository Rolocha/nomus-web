import { yupResolver } from '@hookform/resolvers/yup'
import gql from 'graphql-tag'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'src/apollo'
import { SendPasswordResetEmailMutation } from 'src/apollo/types/SendPasswordResetEmailMutation'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Link from 'src/components/Link'
import Logo from 'src/components/Logo'
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
    await sendPasswordResetEmail({
      variables: {
        email: formData.email,
      },
    })
  }

  return (
    <Box
      container
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="white"
      position="relative"
    >
      <Box display="flex" flexDirection="column" mt={4} maxWidth={500}>
        <Link to="/">
          <Logo mb="32px" />
        </Link>
        <Text.PageHeader>Forgot your password?</Text.PageHeader>
        {formState.isSubmitSuccessful ? (
          <Text.Body2>
            If an account exists with that email, an email will be sent with
            instructions on resetting your password.
          </Text.Body2>
        ) : (
          <Box>
            <Text.Body2 mb={4}>
              Don't worry, it happens to the best of us. Enter your email
              address and we'll email you a link to reset it.
            </Text.Body2>
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
              <Button
                type="submit"
                width="100%"
                variant="primary"
                size="big"
                isLoading={formState.isSubmitting}
              >
                Email me a recovery link
              </Button>
            </Form.Form>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ForgotPassword
