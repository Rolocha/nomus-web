import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'src/apollo'
import { ChangePasswordQuery } from 'src/apollo/types/ChangePasswordQuery'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import PasswordStrengthIndicator from 'src/components/PasswordStrengthIndicator'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import * as yup from 'yup'
import { CHANGE_PASSWORD_MUTATION } from '../mutations'
import { validatePassword } from 'src/utils/password'
import PasswordVisibilityToggle from 'src/components/PasswordVisibilityToggle'
import { colors } from 'src/styles'
import { css } from '@emotion/react'
import Link from 'src/components/Link'

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const bp = 'lg'

const ERROR_MESSAGES = {
  INCORRECT_CURRENT_PASSWORD: 'The current password you entered is incorrect.',
  CURRENT_PASSWORD_REQUIRED: 'Your current password is required.',
  NEW_PASSWORD_REQUIRED: 'Please choose a new password.',
  PASSWORD_TOO_WEAK:
    'Your password is too weak. Please use a stronger password.',
  PASSWORDS_DO_NOT_MATCH: "Passwords don't match",
}

const ChangePasswordForm = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    errors,
    setError,
    clearErrors,
    formState,
  } = useForm<PasswordFormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        currentPassword: yup
          .string()
          .required(ERROR_MESSAGES.CURRENT_PASSWORD_REQUIRED),
        newPassword: yup
          .string()
          .required(ERROR_MESSAGES.NEW_PASSWORD_REQUIRED)
          .test(
            'is-secure',
            ERROR_MESSAGES.PASSWORD_TOO_WEAK,
            validatePassword,
          ),
        confirmPassword: yup
          .string()
          .oneOf(
            [yup.ref('newPassword')],
            ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
          ),
      }),
    ),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const [changePassword] = useMutation<ChangePasswordQuery>(
    CHANGE_PASSWORD_MUTATION,
    { errorPolicy: 'all' },
  )

  const onPasswordChange = async (formData: PasswordFormData) => {
    const response = await changePassword({
      variables: {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      },
    })

    if (response.errors == null) {
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      clearErrors()
    } else {
      // See changePassword in server/src/graphql/resolvers/user.ts for error responses
      if (
        response.errors.some((error) => error.message === 'password-too-weak')
      ) {
        setError('newPassword', {
          type: 'server',
          message: ERROR_MESSAGES.PASSWORD_TOO_WEAK,
        })
      }

      if (
        response.errors.some(
          (error) => error.message === 'incorrect-current-password',
        )
      ) {
        setError('currentPassword', {
          type: 'server',
          message: ERROR_MESSAGES.INCORRECT_CURRENT_PASSWORD,
        })
      }
    }
  }

  return (
    <Form.Form onSubmit={handleSubmit(onPasswordChange)}>
      <Form.Item mb={3}>
        <Box display="flex" justifyContent="space-between">
          <Text.Label>Current Password</Text.Label>
          <PasswordVisibilityToggle
            visible={passwordVisible}
            setVisible={setPasswordVisible}
          />
        </Box>
        <Form.Input
          ref={register({ required: true })}
          name="currentPassword"
          type={passwordVisible ? 'text' : 'password'}
          autoComplete="old-password"
          width="100%"
        />
        <Form.FieldError fieldError={errors.currentPassword} />
      </Form.Item>

      <Form.Item mb={3}>
        <Text.Label>New password</Text.Label>
        <Form.Input
          ref={register({ required: true })}
          name="newPassword"
          type={passwordVisible ? 'text' : 'password'}
          autoComplete="new-password"
          width="100%"
        />
        <PasswordStrengthIndicator password={watch('newPassword')} />
        <Form.FieldError fieldError={errors.newPassword} />
      </Form.Item>

      <Form.Item mb={3}>
        <Text.Label>Confirm new password</Text.Label>
        <Form.Input
          ref={register({ required: true })}
          name="confirmPassword"
          type={passwordVisible ? 'text' : 'password'}
          autoComplete="new-password"
          width="100%"
        />
        <Form.FieldError fieldError={errors.confirmPassword} />
      </Form.Item>

      <Box>
        {formState.isSubmitSuccessful ? (
          <>
            <Box display="flex" alignItems="center">
              <Text.Body2 color={colors.validGreen}>
                <SVG.CheckO
                  color={colors.validGreen}
                  css={css({ verticalAlign: 'bottom', marginRight: '2px' })}
                />
                Password changed!{' '}
                <Link to={null} onClick={() => reset()}>
                  Change again?
                </Link>
              </Text.Body2>
            </Box>
          </>
        ) : (
          <Button
            mt={3}
            width={{ _: '100%', [bp]: '75%' }}
            variant="secondary"
            type="submit"
            inProgress={formState.isSubmitting}
          >
            Change password
          </Button>
        )}
      </Box>
    </Form.Form>
  )
}

export default ChangePasswordForm
