import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'src/apollo'
import { UpdateUsernameMutation } from 'src/apollo/types/UpdateUsernameMutation'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Icon from 'src/components/Icon'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import * as yup from 'yup'
import { UPDATE_USERNAME_MUTATION } from '../mutations'

interface Props {
  username: string
}

interface UsernameFormData {
  username: string
}

const bp = 'lg'

const ChangeUsernameForm = ({ username }: Props) => {
  const [active, setActive] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    errors,
    clearErrors,
    setError,
  } = useForm<UsernameFormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        username: yup.string(),
      }),
    ),
  })

  const [updateUsername] = useMutation<UpdateUsernameMutation>(
    UPDATE_USERNAME_MUTATION,
    { errorPolicy: 'all' },
  )

  React.useEffect(() => {
    reset({ username: username ?? '' })
  }, [reset, username])

  const onSubmitUsername = async (formData: UsernameFormData) => {
    if (formData.username && formData.username !== username) {
      const response = await updateUsername({
        variables: {
          username: formData.username,
        },
      })
      if (response.errors == null) {
        clearErrors()
        reset({ username: formData.username ?? '' })
        setActive(false)
      } else {
        setError('username', {
          type: 'server',
          message: "That username isn't available, sorry. Try another one!",
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
      "username editUsername"
    `,
        [bp]: `
      "username editUsername usernameCopy"
    `,
      }}
      gridColumnGap={3}
      gridRowGap={3}
    >
      <Box gridArea="username">
        <Text.Label>USERNAME/URL</Text.Label>
        {active ? (
          <Form.Form onSubmit={handleSubmit(onSubmitUsername)}>
            <Box display="inline-flex">
              <Text.Body2 mt={1}>{'nomus.me/'}</Text.Body2>
              <Form.Input
                ref={register()}
                name="username"
                type="username"
                autoComplete="username"
                width="100%"
                py={0}
              />
              <Form.Input type="submit" display="none" />
            </Box>
            <Form.FieldError fieldError={errors.username} />
          </Form.Form>
        ) : (
          <Text.Body2 mt={2}>{'nomus.me/' + username}</Text.Body2>
        )}
      </Box>

      <Box gridArea="editUsername" placeSelf={'center'}>
        {active ? (
          <Box
            height="100%"
            display="grid"
            gridTemplateAreas={`
              "save cancel"
            `}
            gridGap={3}
          >
            <Box gridArea="save">
              <Button
                size="sm"
                variant="successSecondary"
                rightIcon={<Icon of="check" color={colors.validGreen} />}
                onClick={handleSubmit(onSubmitUsername)}
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
      <Box gridArea="usernameCopy" display={{ base: 'none', [bp]: 'block' }}>
        <Text.Body3>
          This is your username for this account. Changing your username will
          change your public profile link.
        </Text.Body3>
      </Box>
    </Box>
  )
}

export default ChangeUsernameForm
