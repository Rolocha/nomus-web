import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { gql, useQuery } from 'src/apollo'
import { UserControlPanelSkeletonQuery } from 'src/apollo/types/UserControlPanelSkeletonQuery'
import Banner from 'src/components/Banner'
import Box from 'src/components/Box'
import Link from 'src/components/Link'
import MultiWorkspace from 'src/components/MultiWorkspace'
import Navbar from 'src/components/Navbar'
import * as Text from 'src/components/Text'
import Toast from 'src/components/Toast'
import LoadingPage from 'src/pages/LoadingPage'
import breakpoints from 'src/styles/breakpoints'
import theme from 'src/styles/theme'
import { resendVerificationEmail } from 'src/utils/auth'
import { formatName } from 'src/utils/name'
import CardsSection from './CardsSection'
import ContactsSection from './ContactsSection'
import OrdersSection from './OrdersSection'
import ProfileSection from './ProfileSection'
import SettingsSection from './SettingsSection'

const bp = 'md'

const ProfilePage = () => {
  const { loading, data } = useQuery<UserControlPanelSkeletonQuery>(
    gql`
      query UserControlPanelSkeletonQuery {
        user {
          id
          name {
            first
            middle
            last
          }
          email
          isEmailVerified
        }
      }
    `,
  )

  const location = useLocation()
  const [showJustVerifiedEmail, setShowJustVerifiedEmail] = React.useState<
    boolean | null
  >(null)
  const [
    resentVerificationEmailSuccessfully,
    setResentVerificationEmailSuccessfully,
  ] = React.useState<null | boolean>(null)
  React.useEffect(() => {
    const params = new URLSearchParams(location.search)
    // If we haven't set it yet, set showJustVerifiedEmail to whether it's in the URL query params
    if (showJustVerifiedEmail == null) {
      setShowJustVerifiedEmail(params.get('justVerifiedEmail') != null)
    }
  }, [showJustVerifiedEmail, location])

  if (loading || !data) {
    return <LoadingPage fullscreen />
  }

  return (
    <Box
      bg={theme.colors.ivory}
      minHeight="100vh"
      minWidth={{ base: '0', [bp]: `calc(1.1 * ${breakpoints.lg})` }}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      zIndex={0}
    >
      <Navbar />

      <Box
        zIndex={0}
        pb={{ [bp]: 4 }}
        container={{ base: false, [bp]: true }}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
      >
        <Box
          width={{ [bp]: `min(100%, calc(1.5 * ${breakpoints.lg}))` }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          pb={{ [bp]: 4 }}
        >
          <Box width="100%">
            <Box width="100%" mb={{ base: 0, [bp]: 3 }}>
              {data.user.name && (
                <Box pt={4} pb="24px" display={{ base: 'none', [bp]: 'block' }}>
                  <Text.PageHeader>{`Welcome back, ${formatName(
                    data.user.name,
                  )}`}</Text.PageHeader>
                </Box>
              )}

              {data.user.isEmailVerified !== true && (
                <Banner
                  type="warning"
                  title="Email not verified"
                  borderRadius={{
                    base: 'NONE',
                    [bp]: 'DEFAULT',
                  }}
                  description={
                    <span>
                      {resentVerificationEmailSuccessfully == null && (
                        <>
                          Please confirm your email address by clicking the
                          magic link we sent to your inbox. Didn't get an email?{' '}
                          <Link
                            cursor="pointer"
                            onClick={() => {
                              resendVerificationEmail().then((result) => {
                                setResentVerificationEmailSuccessfully(result)
                              })
                            }}
                          >
                            Resend.
                          </Link>
                        </>
                      )}
                      {resentVerificationEmailSuccessfully && (
                        <span>
                          We sent another verification email. Please check your
                          inbox.
                        </span>
                      )}
                      {/* This should only happen if something went awry on our end... */}
                      {resentVerificationEmailSuccessfully === false && (
                        <span>
                          Uh oh... something went wrong. Please try again later.
                        </span>
                      )}
                    </span>
                  }
                />
              )}
            </Box>

            {data.user.isEmailVerified && showJustVerifiedEmail && (
              <Box mb="16px">
                <Toast
                  type="success"
                  title="Email verified"
                  description="Successfully verified your email address."
                  autoCloseIn={8000}
                  onClickClose={() => {
                    setShowJustVerifiedEmail(false)
                  }}
                />
              </Box>
            )}

            <MultiWorkspace
              children={[
                {
                  key: 'profile',
                  label: 'Profile',
                  icon: 'profile',
                  content: <ProfileSection />,
                },
                {
                  key: 'cards',
                  label: 'Cards',
                  icon: 'cards',
                  content: <CardsSection />,
                },
                {
                  key: 'contacts',
                  linkPath: 'contacts',
                  matchPath: 'contacts/:viewMode?/:username?',
                  label: 'Contacts',
                  icon: 'contacts',
                  content: <ContactsSection />,
                },
                {
                  key: 'orders',
                  linkPath: 'orders',
                  matchPath: 'orders/:orderId?',
                  label: 'Orders',
                  icon: 'orders',
                  content: <OrdersSection />,
                },
                {
                  key: 'settings',
                  label: 'Settings',
                  icon: 'settings',
                  content: <SettingsSection />,
                },
              ]}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfilePage
