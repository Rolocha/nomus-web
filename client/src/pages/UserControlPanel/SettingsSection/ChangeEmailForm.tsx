import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'src/apollo'
import { UpdateProfileQuery } from 'src/apollo/types/UpdateProfileQuery'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Icon from 'src/components/Icon'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import * as yup from 'yup'
import { UPDATE_PROFILE_MUTATION } from '../mutations'

const bp = 'lg'

interface Props {
  email: string
  isEmailVerified: boolean
}

interface EmailFormData {
  email: string
}

const ChangeEmailForm = ({ email, isEmailVerified }: Props) => {
  const [active, setActive] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    errors,
    clearErrors,
    setError,
  } = useForm<EmailFormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("That email doesn't seem right, try a different one"),
      }),
    ),
  })

  const [updateProfile] = useMutation<UpdateProfileQuery>(
    UPDATE_PROFILE_MUTATION,
    { errorPolicy: 'all' },
  )

  React.useEffect(() => {
    reset({ email: email ?? '' })
  }, [reset, email])

  const onSubmitEmail = async (formData: EmailFormData) => {
    if (formData.email && formData.email !== email) {
      const response = await updateProfile({
        variables: {
          updatedUser: { email: formData.email },
        },
      })
      if (response.errors == null) {
        clearErrors()
        reset({ email: formData.email ?? '' })
        setActive(false)
      } else {
        setError('email', {
          type: 'server',
          message: 'Oops, something went wrong. Try again in a bit!',
        })
      }
    } else {
      setActive(false)
    }
  }

  const closeForm = async () => {
    setActive(false)
  }

  return (
    <Box
      height="100%"
      display="grid"
      gridTemplateColumns={{
        _: '8fr 4fr',
        [bp]: '4fr 2fr 6fr',
      }}
      gridTemplateAreas={{
        _: `
        "email editEmail"
      `,
        [bp]: `
        "email editEmail emailCopy"
      `,
      }}
      gridColumnGap={3}
      gridRowGap={3}
    >
      <Box gridArea="email">
        <Text.Label>EMAIL</Text.Label>
        {active ? (
          <Form.Form onSubmit={handleSubmit(onSubmitEmail)}>
            <Form.Input
              ref={register({ required: true })}
              name="email"
              type="email"
              autoComplete="email"
              width="100%"
            />
            <Form.Input type="submit" display="none" />
            <Box>
              <Form.FieldError fieldError={errors.email} />
            </Box>
          </Form.Form>
        ) : (
          <Box display="flex" alignItems="center">
            {!isEmailVerified && <Icon of="exclamationO" mr="4px" />}

            <Text.Body2 mt={1}>{email}</Text.Body2>
          </Box>
        )}
      </Box>

      <Box gridArea="editEmail" placeSelf={{ _: 'end', [bp]: 'end center' }}>
        {active ? (
          <Box
            height="100%"
            display="grid"
            gridTemplateAreas={`
              "save cancel"
            `}
            gridGap={2}
          >
            <Box gridArea="save">
              <Button
                variant="success"
                rightIcon={<Icon of="check" color={colors.validGreen} />}
                onClick={handleSubmit(onSubmitEmail)}
              />
            </Box>
            <Box gridArea="cancel">
              <Button
                variant="dangerSecondary"
                rightIcon={<Icon of="close" color={colors.invalidRed} />}
                onClick={closeForm}
              />
            </Box>
          </Box>
        ) : (
          <Button
            variant="tertiary"
            leftIcon={<Icon of="pen" />}
            onClick={() => {
              setActive(true)
            }}
          >
            <Box as="span" display={{ _: 'none', [bp]: 'inline' }}>
              Edit
            </Box>
          </Button>
        )}
      </Box>

      <Box gridArea="emailCopy" display={{ _: 'none', [bp]: 'block' }}>
        <Text.Body3>
          This is the email associated with your account. If you would like to
          change the email on your profile, go to the Profile tab.
        </Text.Body3>
      </Box>
    </Box>
  )
}

export default ChangeEmailForm
