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
      } else if (response.errors[0].message === 'duplicate-email') {
        setError('email', {
          type: 'server',
          message: 'That email is unavailable, try a different one',
        })
      } else {
        setError('email', {
          type: 'server',
          message: "Something went wrong, we're on it, try again soon!",
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
        base: '8fr 4fr',
        [bp]: '4fr 3fr 5fr',
      }}
      gridTemplateAreas={{
        base: `
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

      <Box gridArea="editEmail" placeSelf={'center'}>
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
                size="sm"
                variant="successSecondary"
                rightIcon={<Icon of="check" color={colors.validGreen} />}
                onClick={handleSubmit(onSubmitEmail)}
              >
                <Box as="span" display={{ base: 'none', [bp]: 'inline' }}>
                  Save
                </Box>
              </Button>
            </Box>
            <Box gridArea="cancel">
              <Button
                size="sm"
                variant="dangerSecondary"
                rightIcon={<Icon of="close" color={colors.invalidRed} />}
                onClick={closeForm}
              >
                <Box as="span" display={{ base: 'none', [bp]: 'inline' }}>
                  Cancel
                </Box>
              </Button>
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
            <Box as="span" display={{ base: 'none', [bp]: 'inline' }}>
              Edit
            </Box>
          </Button>
        )}
      </Box>

      <Box gridArea="emailCopy" display={{ base: 'none', [bp]: 'block' }}>
        <Text.Body3>
          This is the email associated with your account. If you would like to
          change the email on your profile, go to the Profile tab.
        </Text.Body3>
      </Box>
    </Box>
  )
}

export default ChangeEmailForm
