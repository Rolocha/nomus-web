import { css } from '@emotion/react'
import * as React from 'react'
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom'
import Box from 'src/components/Box'
import Link from 'src/components/Link'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { mq } from 'src/styles/breakpoints'
import Icon, { IconName } from './Icon'

interface TabItem {
  icon: IconName
  label: React.ReactNode
  content: React.ReactElement
  key: string
  linkPath?: string
  matchPath?: string
}

interface Props {
  children: Array<TabItem>
}

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
      background-color: ${colors.nomusBlue};
    }
  }
`

const MultiWorkspace = ({ children: tabs }: Props) => {
  const routeMatch = useRouteMatch()
  const location = useLocation()

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', [bp]: 'row' }}
      alignItems={{ [bp]: 'flex-start' }}
      pb={2}
    >
      {/* Menu for selecting dashboard section */}
      <Box
        display="flex"
        flexDirection={{ base: 'row', [bp]: 'column' }}
        flexShrink={0}
        minWidth={{ [bp]: 200 }}
        bg={colors.twilight}
        borderTopLeftRadius={{ base: 'none', [bp]: 'xl' }}
        borderBottomLeftRadius={{ base: 'none', [bp]: 'xl' }}
        // Needed to ensure the current-tab caret indicator is visible
        overflow="visible"
      >
        {tabs.map(({ linkPath, key, icon, label }, index) => {
          const sectionPath = `${routeMatch.url}/${linkPath ?? key}`
          const isCurrentSection = location.pathname.startsWith(sectionPath)
          return (
            <Box
              key={key}
              borderTopLeftRadius={{
                base: 'none',
                [bp]: index === 0 ? 'xl' : 'none',
              }}
              borderBottomLeftRadius={{
                base: 'none',
                [bp]: index === tabs.length - 1 ? 'xl' : 'none',
              }}
              bg={isCurrentSection ? colors.nomusBlue : undefined}
              flexBasis={{
                base: `${100 / tabs.length}%`,
                [bp]: 'auto',
              }}
              position="relative"
              css={isCurrentSection ? POINTY_TAB_INDICATOR : null}
            >
              <Link to={sectionPath}>
                <Box
                  py="24px"
                  px={3}
                  display="flex"
                  flexDirection={{ base: 'column', [bp]: 'row' }}
                  alignItems="center"
                >
                  <Icon
                    of={icon}
                    color="white"
                    boxSize="1.5em"
                    mb={{ base: '0.5em', [bp]: 0 }}
                    mr={{ base: 0, [bp]: '0.7em' }}
                  />
                  <Text.Plain
                    m={0}
                    color="white"
                    fontSize={{ base: 10, [bp]: 'unset' }}
                    fontWeight={isCurrentSection ? 500 : 'undefined'}
                  >
                    {label}
                  </Text.Plain>
                </Box>
              </Link>
            </Box>
          )
        })}
      </Box>

      {/* Content for selected section */}
      <Box
        flexGrow={1}
        boxShadow={{ [bp]: '0px 0px 4px rgba(0, 0, 0, 0.25)' }}
        bg="white"
        borderTopRightRadius={{ [bp]: 'xl' }}
        borderBottomRightRadius={{ [bp]: 'xl' }}
        borderBottomLeftRadius={{ [bp]: 'xl' }}
        position="relative"
        height="100%"
        minHeight="60vh"
        display="flex"
        alignItems="stretch"
        justifyContent="stretch"
      >
        <Switch>
          {tabs.map(({ matchPath, key, content }, index) => (
            <Route key={key} path={`${routeMatch.path}/${matchPath ?? key}`}>
              {({ match }) => (
                <Box
                  overflowY="hidden"
                  height="100%"
                  minHeight="inherit"
                  width="100%"
                  display="flex"
                  alignItems="stretch"
                  justifyContent="stretch"
                >
                  {content}
                </Box>
              )}
            </Route>
          ))}
          {/* If user lands on a route that doesn't match any, redirect to the first one */}
          <Route>
            <Redirect
              to={`${routeMatch.path}/${tabs[0].linkPath ?? tabs[0].key}`}
            />
          </Route>
        </Switch>
      </Box>
    </Box>
  )
}

MultiWorkspace.defaultProps = {}

export default MultiWorkspace
