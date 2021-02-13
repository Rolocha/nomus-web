import { css } from '@emotion/react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { gql, useMutation, useQuery } from 'src/apollo'
import { UCPSettingsSectionQuery } from 'src/apollo/types/UCPSettingsSectionQuery'
import { UpdateProfileQuery } from 'src/apollo/types/UpdateProfileQuery'
import { UpdateUsernameMutation } from 'src/apollo/types/UpdateUsernameMutation'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import EditButton from 'src/components/EditButton'
import * as Form from 'src/components/Form'
import SaveButton from 'src/components/SaveButton'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import LoadingPage from 'src/pages/LoadingPage'
import { useAuth } from 'src/utils/auth'
import { UPDATE_PROFILE_MUTATION, UPDATE_USERNAME_MUTATION } from '../mutations'
import ChangePasswordForm from './ChangePasswordForm'

const bp = 'lg'

interface EmailFormData {
  email: string
}

interface UsernameFormData {
  username: string
}

export default () => {
  const history = useHistory()
  const { logOut } = useAuth()
  const [isEditingEmail, setIsEditingEmail] = React.useState(false)
  const [isEditingUsername, setIsEditingUsername] = React.useState(false)

  const {
    register: emailFormRegister,
    handleSubmit: emailFormHandleSubmit,
    reset: emailFormReset,
    errors: emailErrors,
    clearErrors: clearEmailErrors,
    setError: setEmailError,
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
  const {
    register: usernameFormRegister,
    handleSubmit: usernameFormHandleSubmit,
    reset: usernameFormReset,
    errors: usernameErrors,
    clearErrors: clearUsernameErrors,
    setError: setUsernameError,
  } = useForm<UsernameFormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        username: yup.string(),
      }),
    ),
  })

  const haveSetDefaultRef = React.useRef(false)
  const [updateProfile] = useMutation<UpdateProfileQuery>(
    UPDATE_PROFILE_MUTATION,
    { errorPolicy: 'all' },
  )
  const [updateUsername] = useMutation<UpdateUsernameMutation>(
    UPDATE_USERNAME_MUTATION,
    { errorPolicy: 'all' },
  )

  const { loading, data } = useQuery<UCPSettingsSectionQuery>(
    gql`
      query UCPSettingsSectionQuery {
        user {
          id
          username
          name {
            first
            middle
            last
          }
          email
          isEmailVerified
          activated
        }
      }
    `,
  )

  React.useEffect(() => {
    if (!haveSetDefaultRef.current && data) {
      emailFormReset({ email: data.user.email ?? '' })
      usernameFormReset({ username: data.user.username ?? '' })
      haveSetDefaultRef.current = true
    }
  }, [haveSetDefaultRef, data, emailFormReset, usernameFormReset])

  const onSubmitEmail = async (formData: EmailFormData) => {
    if (formData.email && formData.email !== data?.user.email) {
      const response = await updateProfile({
        variables: {
          updatedUser: { email: formData.email },
        },
      })
      if (response.errors == null) {
        clearEmailErrors()
        emailFormReset({ email: formData.email ?? '' })
        setIsEditingEmail(false)
      } else {
        setEmailError('email', {
          type: 'server',
          message: 'Oops, something went wrong. Try again in a bit!',
        })
      }
    } else {
      setIsEditingEmail(false)
    }
  }

  const onSubmitUsername = async (formData: UsernameFormData) => {
    if (formData.username && formData.username !== data?.user?.username) {
      const response = await updateUsername({
        variables: {
          username: formData.username,
        },
      })
      if (response.errors == null) {
        clearUsernameErrors()
        usernameFormReset({ username: formData.username ?? '' })
        setIsEditingUsername(false)
      } else {
        setUsernameError('username', {
          type: 'server',
          message: "That username isn't available, sorry. Try another one!",
        })
      }
    } else {
      setIsEditingUsername(false)
    }
  }

  if (loading || !data) {
    return <LoadingPage />
  }

  return (
    <Box
      p={{ _: '24px', md: '48px' }}
      overflowY="scroll"
      height="100%"
      display="grid"
      gridTemplateColumns={{
        _: '8fr 4fr',
        [bp]: '4fr 2fr 6fr',
      }}
      gridTemplateAreas={{
        _: `
        "account ."
        "email editEmail"
        "username editUsername"
        "signOut signOut"
        "passwordForm passwordForm"
        "deactivateProfileHeader ."
        "deactivateProfileQuestion deactivateProfileQuestion"
      `,
        [bp]: `
        "account . ."
        "email editEmail emailCopy"
        "username editUsername usernameCopy"
        "signOut . ."
        "passwordForm . ."
        "deactivateProfileHeader . ."
        "deactivateProfileQuestion deactivateProfileButton deactivateProfileCopy"
      `,
      }}
      gridColumnGap={3}
      gridRowGap={3}
    >
      <Box gridArea="account" alignSelf={{ _: 'start', lg: 'center' }}>
        <Text.SectionHeader mb={1} mt={0}>
          Account
        </Text.SectionHeader>
      </Box>

      <Box gridArea="email">
        <Text.Label>EMAIL</Text.Label>
        {isEditingEmail ? (
          <Form.Form onSubmit={emailFormHandleSubmit(onSubmitEmail)}>
            <Form.Input
              ref={emailFormRegister({ required: true })}
              name="email"
              type="email"
              autoComplete="email"
              width="100%"
            />
            <Form.Input type="submit" display="none" />
            <Box>
              <Form.FieldError fieldError={emailErrors.email} />
            </Box>
          </Form.Form>
        ) : (
          <Box display="flex" alignItems="center">
            {!data.user.isEmailVerified && (
              <SVG.ExclamationO css={css({ marginRight: '4px' })} />
            )}

            <Text.Body2 mt={1}>{data.user.email}</Text.Body2>
          </Box>
        )}
      </Box>

      <Box gridArea="editEmail" placeSelf={{ _: 'end', [bp]: 'start center' }}>
        {isEditingEmail ? (
          <SaveButton
            onClick={emailFormHandleSubmit(onSubmitEmail)}
            iconOnlyBp={bp}
          />
        ) : (
          <EditButton
            onClick={() => {
              setIsEditingEmail(true)
              setIsEditingUsername(false)
            }}
            iconOnlyBp={bp}
          />
        )}
      </Box>

      <Box gridArea="emailCopy" display={{ _: 'none', [bp]: 'block' }}>
        <Text.Body3>
          This is the email associated with your account. If you would like to
          change the email on your profile, go to the Profile tab.
        </Text.Body3>
      </Box>

      <Box gridArea="username">
        <Text.Label>USERNAME/URL</Text.Label>
        {isEditingUsername ? (
          <Form.Form onSubmit={usernameFormHandleSubmit(onSubmitUsername)}>
            <Box display="inline-flex">
              <Text.Body2 mt={1}>{'nomus.me/'}</Text.Body2>
              <Form.Input
                ref={usernameFormRegister()}
                name="username"
                type="username"
                autoComplete="username"
                width="100%"
                py={0}
              />
              <Form.Input type="submit" display="none" />
            </Box>
            <Form.FieldError fieldError={usernameErrors.username} />
          </Form.Form>
        ) : (
          <Text.Body2 mt={2}>{'nomus.me/' + data.user.username}</Text.Body2>
        )}
      </Box>

      <Box
        gridArea="editUsername"
        placeSelf={{ _: 'end', [bp]: 'start center' }}
      >
        {isEditingUsername ? (
          <SaveButton
            onClick={usernameFormHandleSubmit(onSubmitUsername)}
            iconOnlyBp={bp}
          />
        ) : (
          <EditButton
            onClick={() => {
              setIsEditingUsername(true)
              setIsEditingEmail(false)
            }}
            iconOnlyBp={bp}
          />
        )}
      </Box>
      <Box gridArea="usernameCopy" display={{ _: 'none', [bp]: 'block' }}>
        <Text.Body3>
          This is your username for this account. Changing your username will
          change your public profile link.
        </Text.Body3>
      </Box>

      <Box gridArea="signOut" display="center">
        <Button
          width={{ _: '100%', [bp]: '75%' }}
          variant="secondary"
          onClick={() => {
            logOut()
            history.push('/')
          }}
        >
          <Box alignItems="center" justifySelf="center">
            <Text.Plain fontSize="14px" color="nomusBlue">
              Sign out
            </Text.Plain>
          </Box>
        </Button>
      </Box>

      <Box gridArea="passwordForm">
        <Text.SectionHeader mb={3} mt={0}>
          Change password
        </Text.SectionHeader>
        <ChangePasswordForm />
      </Box>

      {/* <Box
        gridArea="deactivateProfileHeader"
        alignSelf={{ _: 'start', md: 'center' }}
      >
        <Text.SectionHeader mb={1} mt={0}>
          Profile deactivation
        </Text.SectionHeader>
      </Box>

      <Box
        gridArea="deactivateProfileQuestion"
        display={{ _: 'block', [bp]: 'block' }}
      >
        <Text.Body2>Would you like to deactivate your account?</Text.Body2>
      </Box>

      <Box gridArea="deactivateProfileButton">
        <ActivationEditor
          activatedValue={data.user.activated}
          pageSizeBp={bp}
        />
      </Box>

      <Box
        gridArea="deactivateProfileCopy"
        display={{ _: 'none', [bp]: 'block' }}
      >
        <Text.Body3>
          Upon deactivating your account, you will no longer have a public
          profile tied to any physical business cards you’ve printed, but those
          who already have your contact wlil still have access to your profile.
          You will be able to Reactivate at any time in the future.
        </Text.Body3>
      </Box> */}

      {/* <Box
        gridArea="accountDeletionHeader"
        alignSelf={{ _: 'start', md: 'center' }}
      >
        <Text.SectionHeader mb={1} mt={0}>
          Delete Acccount
        </Text.SectionHeader>
      </Box> */}

      {/* <Box gridArea="accountDeletionQuestion">
        <Text.Body>Would you like to delete your account?</Text.Body>
      </Box> */}

      {/* <Box
        gridArea="accountDeletionButton"
        alignSelf={{ _: 'start', [bp]: 'top center' }}
      >
        <Button width="full" variant="danger">
          <Text.Plain fontSize="14px" color="invalidRed">
            Delete Account
          </Text.Plain>
        </Button>
      </Box> */}

      {/* <Box gridArea="accountDeletionCopy">
        <Text.Body>
          Upon deleting your account, you will no longer have a profile tied to
          any physical business cards you’ve printed. This account is not
          recoverable.
        </Text.Body>
      </Box> */}
    </Box>
  )
}
