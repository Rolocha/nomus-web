import * as React from 'react'
import { useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import * as Text from 'src/components/Text'
import { useAuth } from 'src/utils/auth'

interface RegistrationFormData {
  email: string
  password: string
  firstName: string
  middleName?: string | null
  lastName: string
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

const RegistrationForm = () => {
  const { register, handleSubmit, errors } = useForm<RegistrationFormData>()
  const { logIn } = useAuth()
  const onSubmit = (formData: RegistrationFormData) => {
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
      <Button variant="primary" size="big">
        Continue
      </Button>
    </Box>
  )
}

export default RegistrationForm
