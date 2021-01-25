import { css } from '@emotion/core'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { gql, useMutation, useQuery } from 'src/apollo'
import { ChangePasswordQuery } from 'src/apollo/types/ChangePasswordQuery'
import { UCPSettingsSectionQuery } from 'src/apollo/types/UCPSettingsSectionQuery'
import { UpdateProfileQuery } from 'src/apollo/types/UpdateProfileQuery'
import { UpdateUsernameMutation } from 'src/apollo/types/UpdateUsernameMutation'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import EditButton from 'src/components/EditButton'
import * as Form from 'src/components/Form'
import ProgressBar from 'src/components/ProgressBar'
import SaveButton from 'src/components/SaveButton'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { useAuth } from 'src/utils/auth'
import zxcvbn from 'zxcvbn'
import {
  UPDATE_PROFILE_MUTATION,
  UPDATE_USERNAME_MUTATION,
  CHANGE_PASSWORD_MUTATION,
} from './mutations'

const bp = 'lg'

interface EmailFormData {
  email: string
}

interface UsernameFormData {
  username: string
}

interface PasswordFormData {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
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
  } = useForm<EmailFormData>()
  const {
    register: usernameFormRegister,
    handleSubmit: usernameFormHandleSubmit,
    reset: usernameFormReset,
  } = useForm<UsernameFormData>()
  const {
    register: passwordFormRegister,
    handleSubmit: passwordFormHandleSubmit,
    reset: passwordFormReset,
    watch: passwordFormWatch,
  } = useForm<PasswordFormData>({
    defaultValues: { oldPassword: '', newPassword: '', confirmNewPassword: '' },
  })
  const haveSetDefaultRef = React.useRef(false)
  const [updateProfile] = useMutation<UpdateProfileQuery>(
    UPDATE_PROFILE_MUTATION,
  )
  const [updateUsername] = useMutation<UpdateUsernameMutation>(
    UPDATE_USERNAME_MUTATION,
  )
  const [changePassword] = useMutation<ChangePasswordQuery>(
    CHANGE_PASSWORD_MUTATION,
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

  const onSubmitEmail = (formData: EmailFormData) => {
    updateProfile({
      variables: {
        updatedUser: { email: formData.email },
      },
    })
    setIsEditingEmail(false)
  }

  const onSubmitUsername = (formData: UsernameFormData) => {
    if (formData.username) {
      updateUsername({
        variables: {
          username: formData.username,
        },
      })
    }
    setIsEditingUsername(false)
  }

  const onPasswordChange = (formData: PasswordFormData) => {
    changePassword({
      variables: {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      },
    })
    passwordFormReset({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    })
  }

  if (loading || !data) {
    return <LoadingPage />
  }

  const renderPasswordCopy = (passwordStrength: number): string => {
    return [
      'Way too weak',
      'Pretty weak',
      "It's ok, but you can do better",
      'Awesome',
      'Amazing!',
    ][passwordStrength]
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
        "changePassword ."
        "passwordForm passwordForm"
        "passwordForm passwordForm"
        "passwordForm passwordForm"
        "changePasswordButton changePasswordButton"
        "deactivateProfileHeader ."
        "deactivateProfileQuestion deactivateProfileQuestion"
        "deactivateProfileButton deactivateProfileButton"
      `,
        [bp]: `
        "account . ."
        "email editEmail emailCopy"
        "username editUsername usernameCopy"
        "signOut . ."
        "changePassword . ."
        "passwordForm . passwordCopy1"
        "passwordForm . passwordCopy1"
        "passwordForm . passwordCopy1"
        "changePasswordButton . ."
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
            />
            <Form.Input type="submit" display="none" />
          </Form.Form>
        ) : (
          <Box>
            <Box display="flex" alignItems="center">
              {!data.user.isEmailVerified && (
                <SVG.ExclamationO css={css({ marginRight: '4px' })} />
              )}

              <Text.Body2 mt={1}>{data.user.email}</Text.Body2>
            </Box>
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
            <Box display="flex">
              <Text.Body2 mt={1}>{'nomus.me/'}</Text.Body2>
              <Form.Input
                ref={usernameFormRegister()}
                name="username"
                type="username"
                autoComplete="username"
                py={0}
              />
              <Form.Input type="submit" display="none" />
            </Box>
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

      <Box gridArea="changePassword" alignSelf={{ _: 'start', md: 'center' }}>
        <Text.SectionHeader mb={1} mt={0}>
          Change password
        </Text.SectionHeader>
      </Box>

      <Box gridArea="passwordForm">
        <Form.Form onSubmit={passwordFormHandleSubmit(onPasswordChange)}>
          <Text.Label mb={1}>CURRENT PASSWORD</Text.Label>
          <Form.Input
            ref={passwordFormRegister({ required: true })}
            name="oldPassword"
            type="password"
            autoComplete="old-password"
            width="100%"
          />
          <Form.Input type="submit" display="none" />
          <Text.Label mb={1} mt={3}>
            NEW PASSWORD
          </Text.Label>
          <Form.Input
            ref={passwordFormRegister({ required: true })}
            name="newPassword"
            type="password"
            autoComplete="new-password"
            width="100%"
          />
          <Form.Input type="submit" display="none" />
          <Text.Label mb={1} mt={3}>
            CONFIRM NEW PASSWORD
          </Text.Label>
          <Form.Input
            ref={passwordFormRegister({ required: true })}
            name="confirmNewPassword"
            type="password"
            autoComplete="new-password"
            width="100%"
          />
          <Form.Input type="submit" display="none" />
        </Form.Form>
      </Box>

      {passwordFormWatch('newPassword').length > 0 && (
        <Box gridArea="passwordCopy1" display={{ _: 'none', [bp]: 'block' }}>
          <Text.Body3>New password strength:</Text.Body3>
          <Text.Body3>
            {renderPasswordCopy(zxcvbn(passwordFormWatch('newPassword')).score)}
          </Text.Body3>
          <ProgressBar
            value={zxcvbn(passwordFormWatch('newPassword')).score}
            max={4}
            showPercent={true}
          />
        </Box>
      )}

      <Box gridArea="changePasswordButton">
        <Button
          width={{ _: '100%', [bp]: '75%' }}
          variant="secondary"
          onClick={passwordFormHandleSubmit(onPasswordChange)}
        >
          <Box alignItems="center" justifySelf="center">
            <Text.Plain fontSize="14px" color="nomusBlue">
              Change password
            </Text.Plain>
          </Box>
        </Button>
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
