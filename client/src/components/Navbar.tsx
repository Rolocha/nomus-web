import { css } from '@emotion/core'
import { rgba } from 'polished'
import * as React from 'react'
import { animated, useTransition } from 'react-spring'
import Box from 'src/components/Box'
import Link from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { useAuth } from 'src/utils/auth'
import PopoverButton from './Popover'
import { ABOUT_PAGE_NOTION_LINK, FAQ_PAGE_NOTION_LINK } from 'src/constants'

interface Props {}

interface DirectNavItem {
  name: string
  path: string
  linkType: 'internal' | 'external'
}

interface NestedNavItem {
  name: string
  linkType: 'internal' | 'external'
  nestedItems: Array<DirectNavItem>
}
const isNestedNavItem = (item: NavLink): item is NestedNavItem =>
  'nestedItems' in item

type NavLink = DirectNavItem | NestedNavItem

const navItems: Array<NavLink> = [
  {
    name: 'shop',
    linkType: 'internal',
    path: '/shop',
  },
  {
    name: 'about',
    linkType: 'external',
    path: ABOUT_PAGE_NOTION_LINK,
  },
  {
    name: 'faq',
    linkType: 'external',
    path: FAQ_PAGE_NOTION_LINK,
  },
]

const bp = 'lg'

const Navbar = (props: Props) => {
  const hamburgerMenuForegroundRef = React.useRef<HTMLDivElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { loggedIn } = useAuth()

  const backgroundTransitions = useTransition(mobileMenuOpen, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const foregroundTransitions = useTransition(mobileMenuOpen, null, {
    from: {
      // We need the flexbox base styles on the <animated.div /> so that the modal foreground gets positioned correctly
      position: 'relative',
      width: '100%',
      height: '100%',
      transform: 'translateX(100%)',
    },
    enter: {
      transform: 'translateX(0%)',
    },
    leave: {
      transform: 'translateX(100%)',
    },
  })

  const handleOutsideClick = (event: React.SyntheticEvent<any>) => {
    if (
      // @ts-ignore
      !hamburgerMenuForegroundRef.current.contains(event.target)
    ) {
      setMobileMenuOpen(false)
    }
  }

  // Disable background scroll when menu gets opened
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.querySelector('html')?.classList.add('scroll-lock')
    } else {
      document.querySelector('html')?.classList.remove('scroll-lock')
    }
  }, [mobileMenuOpen])

  return (
    <Box position="relative" zIndex={300} width="100%">
      <Box
        bg="white"
        width="100%"
        display="grid"
        gridTemplateColumns="auto 1fr auto"
        css={css({
          alignItems: 'center',
        })}
        gridColumnGap={4}
        px={4}
        height="100px"
        position="relative"
        zIndex={2}
        boxShadow="navbar"
      >
        <Box>
          <SVG.LogoWithText
            color={colors.nomusBlue}
            css={css`
              height: 60px;
            `}
          />
        </Box>

        {/* Nav menu left-hand items */}
        <Box
          display={{ _: 'none', [bp]: 'flex' }}
          css={css`
            & > *:not(:last-child) {
              margin-right: 40px;
            }
          `}
        >
          {navItems.map((item) => {
            const titleComponent = (
              <Text.Body color={colors.nomusBlue}>{item.name}</Text.Body>
            )

            return (
              <Box key={item.name}>
                {isNestedNavItem(item) ? (
                  <PopoverButton
                    omitIconBg
                    icon={
                      <Box display="flex" alignItems="center">
                        {titleComponent}
                        <SVG.Caret
                          color={colors.nomusBlue}
                          css={css({ transform: 'rotateX(180deg)' })}
                        />
                      </Box>
                    }
                    popoverContents={
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        width="auto"
                        p={2}
                      >
                        {item.nestedItems.map((nestedItem) => {
                          return (
                            <Link
                              key={nestedItem.name}
                              to={nestedItem.path}
                              py={2}
                            >
                              <Text.Body3
                                color={colors.nomusBlue}
                                css={css({ whiteSpace: 'nowrap' })}
                              >
                                {nestedItem.name}
                              </Text.Body3>
                            </Link>
                          )
                        })}
                      </Box>
                    }
                  />
                ) : (
                  <Link to={item.path}>{titleComponent}</Link>
                )}
              </Box>
            )
          })}
        </Box>

        {/* Nav menu right-hand items */}
        <Box placeSelf="center end" flexDirection="row" alignItems="center">
          <Box
            display={{ _: 'none', [bp]: 'flex' }}
            flexDirection="row"
            alignItems="center"
            css={css`
              & > *:not(:first-child) {
                cursor: pointer;
                margin-left: 16px;
              }
            `}
          >
            {loggedIn
              ? [
                  <Link key="dashboard" to="/dashboard">
                    <Box display="flex" alignItems="center">
                      <SVG.Profile />
                      <Text.Body ml={2} color={colors.nomusBlue}>
                        profile
                      </Text.Body>
                    </Box>
                  </Link>,
                ]
              : [
                  <Link key="login" to="/login">
                    <Text.Body ml={2} color={colors.nomusBlue}>
                      sign in
                    </Text.Body>
                  </Link>,
                  <Link
                    key="register"
                    to="/register"
                    asButton
                    buttonStyle="secondary"
                    buttonSize="big"
                    py={2}
                    px={3}
                  >
                    <Text.Body color={colors.nomusBlue}>get started</Text.Body>
                  </Link>,
                ]}
          </Box>
          <Box
            display={{ _: 'block', [bp]: 'none' }}
            cursor="pointer"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
            }}
          >
            <Text.Body2>
              {mobileMenuOpen ? (
                <SVG.Close color={colors.nomusBlue} />
              ) : (
                <SVG.Menu color={colors.nomusBlue} />
              )}
            </Text.Body2>
          </Box>
        </Box>
      </Box>

      {/* Hamburger-opened menu */}
      {backgroundTransitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} style={props}>
              <Box
                onClick={handleOutsideClick}
                zIndex={1}
                position="fixed"
                top="100px"
                right="0"
                height="calc(100vh - 100px)"
                width="100vw"
                bg={`${rgba(colors.nomusBlue, 0.5)}`}
              >
                {foregroundTransitions.map(
                  ({ item, key, props }) =>
                    item && (
                      <animated.div key={key} style={props}>
                        <Box
                          // White foreground of the menu
                          ref={hamburgerMenuForegroundRef}
                          display="flex"
                          position="absolute"
                          height="100%"
                          top="0"
                          right="0"
                          width="70%"
                          maxWidth="350px"
                          bg="white"
                          flexDirection="column"
                          alignItems="start"
                          p="24px"
                          overflowY="auto"
                        >
                          {navItems.map((item) => {
                            const nestedTitle = (
                              <Text.MainNav color={colors.nomusBlue}>
                                {item.name}
                              </Text.MainNav>
                            )
                            return (
                              <Box key={item.name} mb={3}>
                                {isNestedNavItem(item) ? (
                                  nestedTitle
                                ) : (
                                  <Link to={item.path}>{nestedTitle}</Link>
                                )}
                                <Box mt={2}>
                                  {isNestedNavItem(item) &&
                                    item.nestedItems.map((nestedItem) => (
                                      <Link
                                        key={nestedItem.name}
                                        display="block"
                                        to={nestedItem.path}
                                        ml={2}
                                        mb={2}
                                      >
                                        <Text.Body2 color={colors.nomusBlue}>
                                          {nestedItem.name}
                                        </Text.Body2>
                                      </Link>
                                    ))}
                                </Box>
                              </Box>
                            )
                          })}

                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="stretch"
                            width="100%"
                          >
                            <Link
                              asButton
                              buttonStyle="secondary"
                              to="/register"
                            >
                              get started
                            </Link>
                            <Link asButton buttonStyle="tertiary" to="/login">
                              sign in
                            </Link>
                          </Box>
                        </Box>
                      </animated.div>
                    ),
                )}
              </Box>
            </animated.div>
          ),
      )}
    </Box>
  )
}

export default Navbar
