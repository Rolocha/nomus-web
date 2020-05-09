import * as React from 'react'
import { css } from '@emotion/core'
import {
  Redirect,
  Route,
  Switch,
  useRouteMatch,
  useLocation,
} from 'react-router-dom'

import { useQuery, gql } from 'src/apollo'
import { UserControlPanelSkeletonQuery } from 'src/apollo/types/UserControlPanelSkeletonQuery'
import theme from 'src/styles/theme'
import LoadingPage from 'src/pages/LoadingPage'
import { formatName } from 'src/utils/name'

import { InternalLink } from 'src/components/Link'
import { PageHeader, Body } from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import Box from 'src/components/Box'
import Container from 'src/components/Container'
import Navbar from 'src/components/Navbar'
import ProfileSection from './ProfileSection'
import CardsSection from './CardsSection'
import ContactsSection from './ContactsSection'
import SettingsSection from './SettingsSection'

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

  const controlPanelSections = [
    {
      path: 'profile',
      label: 'Profile',
      Icon: SVG.Profile,
      Component: ProfileSection,
    },
    {
      path: 'cards',
      label: 'Card Management',
      Icon: SVG.Cards,
      Component: CardsSection,
    },
    {
      path: 'contacts',
      label: 'Contacts',
      Icon: SVG.Contacts,
      Component: ContactsSection,
    },
    {
      path: 'settings',
      label: 'Settings',
      Icon: SVG.Settings,
      Component: SettingsSection,
    },
  ]

  return (
    <Box bg="white" position="relative">
      <Navbar />
      <Container bg={theme.colors.bgBeige} pb={4}>
        {data.user.name && (
          <Box overflow="auto">
            <PageHeader>
              {`Welcome back, ${formatName(data.user.name)}`}
            </PageHeader>
          </Box>
        )}
        <Box display="flex" flexDirection="row">
          {/* Menu for selecting dashboard section */}
          <Box>
            {controlPanelSections.map(({ path, Icon, label }, index) => {
              const sectionPath = `${routeMatch.url}/${path}`
              const isCurrentSection = location.pathname === sectionPath
              return (
                <Box
                  key={path}
                  bg={
                    isCurrentSection
                      ? theme.colors.primaryTeal
                      : theme.colors.secondaryTeal
                  }
                  p={3}
                  flexBasis="content"
                  position="relative"
                  borderTopLeftRadius={index === 0 ? '24px' : '0'}
                  borderBottomLeftRadius={
                    index === controlPanelSections.length - 1 ? '24px' : '0'
                  }
                  css={
                    isCurrentSection
                      ? css`
                          // Render the little pointy current-tab indicator
                          // It's just a 1rem x 1rem box rotated 45º
                          &:after {
                            content: ' ';
                            display: block;
                            width: 1rem;
                            height: 1rem;
                            position: absolute;
                            top: 50%;
                            left: 100%;
                            transform: translate(-50%, -50%) rotate(45deg);
                            background-color: ${theme.colors.primaryTeal};
                          }
                        `
                      : null
                  }
                >
                  <InternalLink noUnderline to={sectionPath}>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <Icon
                        color="white"
                        css={css`
                          height: 1.5em;
                          margin-right: 0.7em;
                        `}
                      />
                      <Body m={0} color="white">
                        {label}
                      </Body>
                    </Box>
                  </InternalLink>
                </Box>
              )
            })}
          </Box>

          {/* Content for selected section */}
          <Box
            flexGrow={1}
            boxShadow="0px 0px 4px rgba(0, 0, 0, 0.25)"
            bg="white"
            padding={5}
            // Just for now
            minHeight="100vh"
          >
            <Switch>
              {controlPanelSections.map(({ path, Component }) => (
                <Route key={path} path={`${routeMatch.url}/${path}`}>
                  <Component />
                </Route>
              ))}
              {/* If user lands on a route that doesn't match any, redirect to the first one */}
              <Route>
                <Redirect
                  to={`${routeMatch.url}/${controlPanelSections[0].path}`}
                />
              </Route>
            </Switch>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default ProfilePage
