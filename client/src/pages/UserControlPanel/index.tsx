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
import { mq } from 'src/styles/breakpoints'
import LoadingPage from 'src/pages/LoadingPage'
import { formatName } from 'src/utils/name'

import { InternalLink } from 'src/components/Link'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import ProfileSection from './ProfileSection'
import CardsSection from './CardsSection'
import ContactsSection from './ContactsSection'
import SettingsSection from './SettingsSection'

const bp = 'md'
const POINTY_TAB_INDICATOR = css`
  ${mq[bp]} {
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
  }
`

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
      label: 'Cards',
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
    <Box
      bg={theme.colors.bgBeige}
      minHeight={{ [bp]: '100vh' }}
      position="relative"
    >
      <Navbar />
      <Box
        pb={{ [bp]: 4 }}
        container={{
          _: false,
          [bp]: true,
        }}
      >
        {data.user.name && (
          <Box overflow="auto" display={{ _: 'none', [bp]: 'block' }}>
            <Text.PageHeader>
              {`Welcome back, ${formatName(data.user.name)}`}
            </Text.PageHeader>
          </Box>
        )}
        <Box
          display="flex"
          flexDirection={{ _: 'column', [bp]: 'row' }}
          alignItems={{ [bp]: 'flex-start' }}
        >
          {/* Menu for selecting dashboard section */}
          <Box
            display="flex"
            flexDirection={{ _: 'row', [bp]: 'column' }}
            minWidth={{ [bp]: 200 }}
            bg={theme.colors.secondaryTeal}
            borderTopLeftRadius={{ _: 0, [bp]: 3 }}
            borderBottomLeftRadius={{ _: 0, [bp]: 3 }}
            // Needed to match the border-radius of selected item
            overflow="hidden"
          >
            {controlPanelSections.map(({ path, Icon, label }, index) => {
              const sectionPath = `${routeMatch.url}/${path}`
              const isCurrentSection = location.pathname === sectionPath
              return (
                <Box
                  key={path}
                  bg={isCurrentSection ? theme.colors.primaryTeal : undefined}
                  p={3}
                  flexBasis={{
                    _: `${100 / controlPanelSections.length}%`,
                    [bp]: 'auto',
                  }}
                  position="relative"
                  css={isCurrentSection ? POINTY_TAB_INDICATOR : null}
                >
                  <InternalLink noUnderline to={sectionPath}>
                    <Box
                      display="flex"
                      flexDirection={{ _: 'column', [bp]: 'row' }}
                      alignItems="center"
                    >
                      <Icon
                        color="white"
                        css={css`
                          height: 1.5em;

                          // Margin below in mobile; on right in desktop
                          margin-bottom: 0.5em;
                          ${mq[bp]} {
                            margin-right: 0.7em;
                          }
                        `}
                      />
                      <Text.Plain
                        m={0}
                        color="white"
                        fontSize={{ _: 10, [bp]: 16 }}
                        fontWeight={isCurrentSection ? 'bold' : 'undefined'}
                      >
                        {label}
                      </Text.Plain>
                    </Box>
                  </InternalLink>
                </Box>
              )
            })}
          </Box>

          {/* Content for selected section */}
          <Box
            flexGrow={1}
            boxShadow={{ [bp]: '0px 0px 4px rgba(0, 0, 0, 0.25)' }}
            bg="white"
            padding={5}
            borderTopRightRadius={{ [bp]: 3 }}
            borderBottomRightRadius={{ [bp]: 3 }}
            borderBottomLeftRadius={{ [bp]: 3 }}
            // Just for now
            minHeight="50vh"
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
      </Box>
    </Box>
  )
}

export default ProfilePage
