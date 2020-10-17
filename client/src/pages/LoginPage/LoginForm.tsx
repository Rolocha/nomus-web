import * as React from 'react'
import { useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import * as Text from 'src/components/Text'
import { useAuth } from 'src/utils/auth'

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
    <Text.Body color="brightCoral" m={1}>
      {`${fieldName} is required`}
    </Text.Body>
  ) : null

const LoginForm = () => {
  const { register, handleSubmit, errors } = useForm<LoginFormData>()
  const { logIn } = useAuth()
  const onSubmit = (formData: LoginFormData) => {
    logIn(formData)
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
          <Form.Label htmlFor="password">PASSWORD</Form.Label>
          <Form.Input
            name="password"
            ref={register({ required: true })}
            type="password"
            autoComplete="current-password"
          />
          {showRequiredError('password', 'Password', errors)}
        </Form.Item>
        <Button type="submit" width="100%" variant="primary" size="big">
          Continue
        </Button>
      </Form.Form>
    </Box>
  )
}

export default LoginForm
