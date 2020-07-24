import * as React from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { gql, useQuery } from 'src/apollo'
import { UserControlPanelSkeletonQuery } from 'src/apollo/types/UserControlPanelSkeletonQuery'
import Box from 'src/components/Box'
import MultiWorkspace from 'src/components/MultiWorkspace'
import Navbar from 'src/components/Navbar'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import breakpoints, { mq } from 'src/styles/breakpoints'
import theme from 'src/styles/theme'
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
          name {
            first
            middle
            last
          }
        }
      }
    `,
  )
  const routeMatch = useRouteMatch()
  const location = useLocation()

  if (loading || !data) {
    return <LoadingPage />
  }

  return (
    <Box
      bg={theme.colors.ivory}
      minHeight={{ [bp]: '100vh' }}
      minWidth={{ _: '0', [bp]: `calc(1.1 * ${breakpoints.lg})` }}
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
        px={{ _: 0, [bp]: 5 }}
        maxWidth={{ [bp]: `calc(1.5 * ${breakpoints.lg})` }}
      >
        {data.user.name && (
          <Box
            overflow="auto"
            mt={4}
            mb="24px"
            display={{ _: 'none', [bp]: 'block' }}
          >
            <Text.PageHeader>
              {`Welcome back, ${formatName(data.user.name)}`}
            </Text.PageHeader>
          </Box>
        )}
        <MultiWorkspace
          children={[
            {
              path: 'profile',
              label: 'Profile',
              Icon: SVG.Profile,
              content: <ProfileSection />,
            },
            {
              path: 'cards',
              label: 'Cards',
              Icon: SVG.Cards,
              content: <CardsSection />,
            },
            {
              linkPath: 'contacts',
              matchPath: 'contacts/:viewMode?/:usernameOrId?',
              label: 'Contacts',
              Icon: SVG.Contacts,
              content: <ContactsSection />,
            },
            {
              linkPath: 'orders',
              matchPath: 'orders/:orderId?',
              label: 'Orders',
              Icon: SVG.Orders,
              content: <OrdersSection />,
            },
            {
              path: 'settings',
              label: 'Settings',
              Icon: SVG.Settings,
              content: <SettingsSection />,
            },
          ]}
        />
      </Box>
    </Box>
  )
}

export default ProfilePage
