import { css } from '@emotion/core'
import * as React from 'react'
import { Redirect, Route, useLocation, useRouteMatch } from 'react-router-dom'
import Box from 'src/components/Box'
import { InternalLink } from 'src/components/Link'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { mq } from 'src/styles/breakpoints'

interface TabItem {
  Icon: (...args: any) => JSX.Element
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
      flexDirection={{ _: 'column', [bp]: 'row' }}
      alignItems={{ [bp]: 'flex-start' }}
      pb={2}
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
        {tabs.map(({ linkPath, key, Icon, label }, index) => {
          const sectionPath = `${routeMatch.url}/${linkPath ?? key}`
          const isCurrentSection = location.pathname.startsWith(sectionPath)
          return (
            <Box
              key={key}
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
        borderTopRightRadius={{ [bp]: 3 }}
        borderBottomRightRadius={{ [bp]: 3 }}
        borderBottomLeftRadius={{ [bp]: 3 }}
        position="relative"
        height="100%"
      >
        {tabs.map(({ matchPath, key, content }, index) => (
          <Route key={key} path={`${routeMatch.path}/${matchPath ?? key}`}>
            {({ match }) => (
              <Box
                overflowY="hidden"
                height="100%"
                // Rather than mounting/unmounting the different pages, we simply adjust the
                // display block so that their inner state doesn't get lost. Not the most performant
                // but it'll do fine for now
                display={(() => {
                  // debugger
                  return match?.path.endsWith(matchPath ?? key)
                    ? 'block'
                    : 'none'
                })()}
              >
                <Box overflowY="hidden" height="100%">
                  {content}
                </Box>
              </Box>
            )}
          </Route>
        ))}
        {/* If user lands on a route that doesn't match any, redirect to the first one */}
        <Route exact path={`${routeMatch.path}`}>
          <Redirect
            to={`${routeMatch.path}/${tabs[0].linkPath ?? tabs[0].key}`}
          />
        </Route>
      </Box>
    </Box>
  )
}

MultiWorkspace.defaultProps = {}

export default MultiWorkspace
