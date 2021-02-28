import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { gql, useQuery } from 'src/apollo'
import { UCPSettingsSectionQuery } from 'src/apollo/types/UCPSettingsSectionQuery'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { useAuth } from 'src/utils/auth'
import ChangePasswordForm from './ChangePasswordForm'
import ChangeUsernameForm from './ChangeUsernameForm'
import ChangeEmailForm from './ChangeEmailForm'

const bp = 'lg'

export default () => {
  const history = useHistory()
  const { logOut } = useAuth()

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

  if (loading || !data) {
    return <LoadingPage />
  }

  return (
    <Box
      p={{ base: '24px', md: '48px' }}
      height="100%"
      width="100%"
      display="grid"
      gridTemplateColumns={{
        base: '8fr 4fr',
        [bp]: '4fr 2fr 6fr',
      }}
      gridTemplateAreas={{
        base: `
        "account ."
        "email email"
        "username username"
        "signOut signOut"
        "passwordForm passwordForm"
      `,
        [bp]: `
        "account . ."
        "email email email"
        "username username username"
        "signOut . ."
        "passwordForm . ."
      `,
      }}
      gridColumnGap={3}
      gridRowGap={3}
    >
      <Box gridArea="account" alignSelf={{ base: 'start', lg: 'center' }}>
        <Text.SectionHeader mb={1} mt={0}>
          Account
        </Text.SectionHeader>
      </Box>

      <Box gridArea="email">
        <ChangeEmailForm
          email={data?.user.email ?? ''}
          isEmailVerified={data?.user.isEmailVerified}
        />
      </Box>

      <Box gridArea="username">
        <ChangeUsernameForm username={data?.user.username ?? ''} />
      </Box>

      <Box gridArea="signOut" display="center">
        <Button
          width={{ base: '100%', [bp]: '75%' }}
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
        alignSelf={{ base:'start', md: 'center' }}
      >
        <Text.SectionHeader mb={1} mt={0}>
          Profile deactivation
        </Text.SectionHeader>
      </Box>

      <Box
        gridArea="deactivateProfileQuestion"
        display={{ base:'block', [bp]: 'block' }}
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
        display={{ base:'none', [bp]: 'block' }}
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
        alignSelf={{ base:'start', md: 'center' }}
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
        alignSelf={{ base:'start', [bp]: 'top center' }}
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
