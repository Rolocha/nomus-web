import * as React from 'react'
import Box from 'src/components/Box'
import { useQuery, gql, useMutation } from 'src/apollo'
import { UpdateProfileQuery } from 'src/apollo/types/UpdateProfileQuery'
import { UCPSettingsSectionQuery } from 'src/apollo/types/UCPSettingsSectionQuery'
import LoadingPage from 'src/pages/LoadingPage'
import * as Text from 'src/components/Text'
import * as Form from 'src/components/Form'
import { useForm } from 'react-hook-form'
import EditButton from './EditButton'
import UPDATE_PROFILE_MUTATION from './updateProfileMutation'
import CHANGE_PASSWORD_MUTATION from './changePasswordMutation'
import Button from 'src/components/Button'
import { useAuth } from 'src/utils/auth'
import { useHistory } from 'react-router-dom'
import { ChangePasswordQuery } from 'src/apollo/types/ChangePasswordQuery'

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
  const [isUserProfileActive, setUserProfileActive] = React.useState(true)
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
  } = useForm<PasswordFormData>()
  const haveSetDefaultRef = React.useRef(false)
  const [updateProfile] = useMutation<UpdateProfileQuery>(
    UPDATE_PROFILE_MUTATION,
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
          activated
        }
      }
    `,
  )

  React.useEffect(() => {
    if (!haveSetDefaultRef.current && data) {
      emailFormReset({ email: data.user.email ?? '' })
    }
  }, [haveSetDefaultRef, data, emailFormReset])

  React.useEffect(() => {
    if (!haveSetDefaultRef.current && data) {
      usernameFormReset({ username: data.user.username ?? '' })
    }
  }, [haveSetDefaultRef, data, usernameFormReset])

  React.useEffect(() => {
    if (!haveSetDefaultRef.current && data) {
      passwordFormReset({ oldPassword: '', newPassword: '' })
    }
  }, [haveSetDefaultRef, data, passwordFormReset])

  React.useEffect(() => {
    if (!haveSetDefaultRef.current && data) {
      setUserProfileActive(data.user.activated)
    }
  }, [haveSetDefaultRef, data, setUserProfileActive])

  const onSubmitEmail = (formData: EmailFormData) => {
    updateProfile({
      variables: {
        updatedUser: { email: formData.email },
      },
    })
    setIsEditingEmail(false)
  }

  const onSubmitUsername = (formData: UsernameFormData) => {
    updateProfile({
      variables: {
        updatedUser: { username: formData.username },
      },
    })
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
  }

  const onActivationChange = (activationStatus: boolean) => {
    updateProfile({
      variables: {
        updatedUser: { activated: activationStatus },
      },
    })
    setUserProfileActive(activationStatus)
  }

  if (loading || !data) {
    return <LoadingPage />
  }

  return (
    <Box
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
        "signOut ."
        "resetPassword ."
        "passwordForm passwordCopy1"
        "passwordForm passwordCopy2"
        "passwordForm passwordCopy2"
        "resetPasswordButton ."
        "deactivateProfileHeader ."
        "deactivateProfileCopy deactivateProfileButton"
      `,
        [bp]: `
        "account . ."
        "email editEmail emailCopy"
        "username editUsername usernameCopy"
        "signOut . ."
        "resetPassword . ."
        "passwordForm . passwordCopy1"
        "passwordForm . passwordCopy2"
        "passwordForm . passwordCopy2"
        "resetPasswordButton . ."
        "deactivateProfileHeader . ."
        "deactivateProfileQuestion deactivateProfileButton deactivateProfileCopy"
      `,
      }}
      gridColumnGap={2}
      gridRowGap={3}
    >
      <Box gridArea="account" alignSelf={{ _: 'start', lg: 'center' }}>
        <Text.SectionHeader mb={1} mt={0}>
          Account
        </Text.SectionHeader>
      </Box>

      <Box gridArea="email">
        <Text.Label mb={1}>EMAIL</Text.Label>
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
          <Text.Body>{data.user.email}</Text.Body>
        )}
      </Box>

      <Box gridArea="editEmail" placeSelf={{ _: 'start', [bp]: 'center' }}>
        {isEditingEmail ? (
          <EditButton onClick={emailFormHandleSubmit(onSubmitEmail)} />
        ) : (
          <EditButton
            onClick={() => {
              setIsEditingEmail(true)
              setIsEditingUsername(false)
            }}
          />
        )}
      </Box>

      <Box gridArea="emailCopy" display={{ _: 'none', [bp]: 'block' }}>
        <Text.Body>
          This is the email associated with your account. If you would like to
          change the email on your profile, go to the Profile tab.
        </Text.Body>
      </Box>

      <Box gridArea="username">
        <Text.Label>USERNAME/URL</Text.Label>
        {isEditingUsername ? (
          <Form.Form onSubmit={usernameFormHandleSubmit(onSubmitUsername)}>
            <Text.Body>{'nomus.me/u/'}</Text.Body>
            <Form.Input
              ref={usernameFormRegister({ required: true })}
              name="username"
              type="username"
              autoComplete="username"
            />
            <Form.Input type="submit" display="none" />
          </Form.Form>
        ) : (
          <Text.Body>{'nomus.me/u/' + data.user.username}</Text.Body>
        )}
      </Box>

      <Box
        gridArea="editUsername"
        placeSelf={{ _: 'end start', [bp]: 'center' }}
      >
        {isEditingUsername ? (
          <EditButton onClick={usernameFormHandleSubmit(onSubmitUsername)} />
        ) : (
          <EditButton
            onClick={() => {
              setIsEditingUsername(true)
              setIsEditingEmail(false)
            }}
          />
        )}
      </Box>

      <Box gridArea="usernameCopy" display={{ _: 'none', [bp]: 'block' }}>
        <Text.Body>
          This is the username associated with your account and the public URL
          that leads to your profile. Changing your username will change your
          public profile link.
        </Text.Body>
      </Box>

      <Box gridArea="signOut" display={{ _: 'block', [bp]: 'block' }}>
        <Button
          width="full"
          variant="secondary"
          onClick={() => {
            logOut()
            history.push('/')
          }}
        >
          <Box alignItems="center" justifySelf="center">
            <Text.Plain fontSize="14px" color="nomusBlue">
              Sign Out
            </Text.Plain>
          </Box>
        </Button>
      </Box>

      <Box gridArea="resetPassword" alignSelf={{ _: 'start', md: 'center' }}>
        <Text.SectionHeader mb={1} mt={0}>
          Reset Password
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

      <Box gridArea="passwordCopy1">
        <Text.Body>Your new password needs at least:</Text.Body>
      </Box>

      <Box gridArea="passwordCopy2">
        <Text.Body>
          8 characters <br />
          1 letter <br />
          1 symbol <br />
          1 number <br />
        </Text.Body>
      </Box>

      <Box gridArea="resetPasswordButton">
        <Button
          width="full"
          variant="secondary"
          onClick={passwordFormHandleSubmit(onPasswordChange)}
        >
          <Box alignItems="center" justifySelf="center">
            <Text.Plain fontSize="14px" color="nomusBlue">
              Reset Password
            </Text.Plain>
          </Box>
        </Button>
      </Box>

      <Box
        gridArea="deactivateProfileHeader"
        alignSelf={{ _: 'start', md: 'center' }}
      >
        <Text.SectionHeader mb={1} mt={0}>
          Deactivate Profile
        </Text.SectionHeader>
      </Box>

      <Box
        gridArea="deactivateProfileQuestion"
        display={{ _: 'none', [bp]: 'block' }}
      >
        <Text.Body>Would you like to deactivate your account?</Text.Body>
      </Box>

      <Box
        gridArea="deactivateProfileButton"
        alignSelf={{ _: 'start', [bp]: 'top center' }}
      >
        {isUserProfileActive ? (
          <Button
            width="full"
            variant="danger"
            onClick={async () => {
              await onActivationChange(false)
            }}
          >
            <Text.Plain fontSize="14px" color="invalidRed">
              Deactivate
            </Text.Plain>
          </Button>
        ) : (
          <Button
            width="full"
            variant="recover"
            onClick={async () => {
              await onActivationChange(true)
            }}
          >
            <Text.Plain fontSize="14px" color="validGreen">
              Activate
            </Text.Plain>
          </Button>
        )}
      </Box>

      <Box gridArea="deactivateProfileCopy">
        <Text.Body>
          Upon deactivating your account, you will no longer have a public
          profile tied to any physical business cards you’ve printed, but those
          who already have your contact wlil still have access to your profile.
          You will be able to Reactivate at any time in the future.
        </Text.Body>
      </Box>

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
