import { css } from '@emotion/core'
import * as React from 'react'
import * as Text from 'src/components/Text'
import Box from 'src/components/Box'
import { InternalLink } from 'src/components/Link'
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom'
import { colors } from 'src/styles'
import breakpoints, { mq } from 'src/styles/breakpoints'

interface TabItem {
  Icon: (...args: any) => JSX.Element
  label: React.ReactNode
  content: React.ReactNode
  path?: string
  linkPath?: string
  matchPath?: string
}

interface Props {
  children: Array<TabItem>
  wizard: boolean
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

const MultiWorkspace = ({ wizard, children: tabs }: Props) => {
  const routeMatch = useRouteMatch()
  const location = useLocation()

  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', [bp]: 'row' }}
      alignItems={{ [bp]: 'flex-start' }}
    >
      {/* Menu for selecting dashboard section */}
      <Box
        display="flex"
        flexDirection={{ _: 'row', [bp]: 'column' }}
        flexShrink={0}
        minWidth={{ [bp]: 200 }}
        bg={colors.twilight}
        borderTopLeftRadius={{ _: 0, [bp]: 3 }}
        borderBottomLeftRadius={{ _: 0, [bp]: 3 }}
        // Needed to ensure the current-tab caret indicator is visible
        overflow="visible"
      >
        {tabs.map(({ linkPath, path, Icon, label }, index) => {
          const sectionPath = `${routeMatch.url}/${linkPath ?? path}`
          const isCurrentSection = location.pathname.startsWith(sectionPath)
          return (
            <Box
              key={path}
              borderTopLeftRadius={{ _: 0, [bp]: index === 0 ? 3 : 0 }}
              borderBottomLeftRadius={{
                _: 0,
                [bp]: index === tabs.length - 1 ? 3 : 0,
              }}
              bg={isCurrentSection ? colors.nomusBlue : undefined}
              flexBasis={{
                _: `${100 / tabs.length}%`,
                [bp]: 'auto',
              }}
              position="relative"
              css={isCurrentSection ? POINTY_TAB_INDICATOR : null}
            >
              <InternalLink to={sectionPath}>
                <Box
                  py="24px"
                  px={3}
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
                        margin-bottom: 0;
                        margin-right: 0.7em;
                      }
                    `}
                  />
                  <Text.Plain
                    m={0}
                    color="white"
                    fontSize={{ _: 10, [bp]: 'unset' }}
                    fontWeight={isCurrentSection ? 500 : 'undefined'}
                  >
                    {wizard ? `Step ${index + 1} / ${label}` : label}
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
        p={{ _: '24px', [bp]: '48px' }}
        // py={{ _: 4, [bp]: 5 }}
        borderTopRightRadius={{ [bp]: 3 }}
        borderBottomRightRadius={{ [bp]: 3 }}
        borderBottomLeftRadius={{ [bp]: 3 }}
        // Just for now
        minHeight="50vh"
        position="relative"
      >
        <Switch>
          {tabs.map(({ matchPath, path, content }, index) => (
            <Route key={path} path={`${routeMatch.url}/${matchPath ?? path}`}>
              <Box>{content}</Box>
              {/* Previous step button */}
              {wizard && tabs[index - 1] != null && (
                <InternalLink
                  px={{ _: 2, [bp]: 4 }}
                  py={{ _: 1, [bp]: 3 }}
                  css={css`
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: translate(5%, 110%);
                    ${mq[bp]} {
                      transform: translate(-10%, 30%);
                    }
                  `}
                  to={
                    tabs[index - 1].linkPath || (tabs[index - 1].path as string)
                  }
                  asButton
                  buttonStyle="primary"
                >{`Previous step: ${tabs[index - 1].label}`}</InternalLink>
              )}
              {/* Next step button */}
              {wizard && tabs[index + 1] != null && (
                <InternalLink
                  px={{ _: 2, [bp]: 4 }}
                  py={{ _: 1, [bp]: 3 }}
                  css={css`
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    transform: translate(-5%, 110%);
                    ${mq[bp]} {
                      transform: translate(10%, 30%);
                    }
                  `}
                  to={
                    tabs[index + 1].linkPath || (tabs[index + 1].path as string)
                  }
                  asButton
                  buttonStyle="primary"
                >{`Next step: ${tabs[index + 1].label}`}</InternalLink>
              )}
            </Route>
          ))}
          {/* If user lands on a route that doesn't match any, redirect to the first one */}
          <Route>
            <Redirect
              to={`${routeMatch.url}/${tabs[0].linkPath ?? tabs[0].path}`}
            />
          </Route>
        </Switch>
      </Box>
    </Box>
  )
}

MultiWorkspace.defaultProps = {
  wizard: false,
}

export default MultiWorkspace
