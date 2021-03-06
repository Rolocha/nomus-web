import { yupResolver } from '@hookform/resolvers/yup'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { useForm } from 'react-hook-form'
import { BrowserRouter as Router } from 'react-router-dom'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import * as Text from 'src/components/Text'
import * as yup from 'yup'
import Link from '../Link'
import PasswordVisibilityToggle from '../PasswordVisibilityToggle'

export default {
  title: 'components/Form',
  component: Form,
  excludeStories: /.*Data$/,
  decorators: [
    (Story: any) => (
      <Router>
        <Story />
      </Router>
    ),
  ],
}

export const actionsData = {
  onClick: action('clicked'),
}

interface FormData {
  email: string
  password: string
}

export const ExampleForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    watch,
  } = useForm<FormData>({
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

  const values = watch()

  const [passwordVisible, setPasswordVisible] = React.useState(false)

  const onSubmit = async (formData: FormData) => {
    await new Promise((res) => setTimeout(res, 1000))
    window.confirm('Submit form with data: ' + JSON.stringify(formData))
  }

  return (
    <Box maxW="600px" p={4}>
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
          />
          <Text.Body3>
            <Link to="#">Forgot your password?</Link>
          </Text.Body3>
          <Form.FieldError fieldError={errors.password} />
        </Form.Item>
        <Button
          type="submit"
          width="100%"
          variant="primary"
          size="big"
          isLoading={formState.isSubmitting}
          loadingText="Logging in"
        >
          Continue
        </Button>
      </Form.Form>
      <Box mt={3}>
        <Text.Body2>Email: {values.email}</Text.Body2>
        <Text.Body2>Password: {values.password}</Text.Body2>
      </Box>
    </Box>
  )
}
