import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Link from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { useAuth } from 'src/utils/auth'
import * as yup from 'yup'

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
    <Text.Body3 color="brightCoral" m={1}>
      {`${fieldName} is required`}
    </Text.Body3>
  ) : null

const RegistrationForm = () => {
  const { register, handleSubmit, formState, errors } = useForm<
    RegistrationFormData
  >({
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({
        firstName: yup.string().required(),
        middleName: yup.string(),
        lastName: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().required(),
      }),
    ),
  })
  const { signUp } = useAuth()
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const [submittingForm, setSubmittingForm] = React.useState(false)

  const onSubmit = async (formData: RegistrationFormData) => {
    setSubmittingForm(true)
    try {
      await signUp(formData)
    } finally {
      setSubmittingForm(false)
    }
  }

  return (
    <Box display="flex" flexDirection="column" mt={4}>
      <Form.Form onSubmit={handleSubmit(onSubmit)}>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gridColumnGap="16px">
          <Form.Item mb="20px">
            <Form.Label htmlFor="email">FIRST NAME</Form.Label>
            <Form.Input
              name="firstName"
              ref={register({ required: true })}
              type="text"
              autoComplete="firstName"
            />
            {showRequiredError('firstName', 'First name', errors)}
          </Form.Item>
          <Form.Item mb="20px">
            <Form.Label htmlFor="email">LAST NAME</Form.Label>
            <Form.Input
              name="lastName"
              ref={register({ required: true })}
              type="text"
              autoComplete="lastName"
            />
            {showRequiredError('lastName', 'Last name', errors)}
          </Form.Item>
        </Box>
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
          variant="primary"
          size="big"
          inProgress={submittingForm}
          inProgressText="Creating your account"
          disabled={!formState.isValid}
          type="submit"
          width="100%"
        >
          Create free account
        </Button>
      </Form.Form>
      <Text.Body2 textAlign="center" mt={2}>
        By clicking Create free account, you agree to our{' '}
        <Link to="terms-of-service">Terms of Service</Link> and{' '}
        <Link to="privacy-policy">Privacy Policy</Link>.
      </Text.Body2>
    </Box>
  )
}

export default RegistrationForm
