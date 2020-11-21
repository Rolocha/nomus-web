import { css } from '@emotion/core'
import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import Link from 'src/components/Link'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import { useAuth } from 'src/utils/auth'
import illustration from './login-illustration.svg'
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'
import logoFull from './logo-full.svg'
import { colors } from 'src/styles'

const bp = 'lg'

const LoginPage = () => {
  const { loggedIn } = useAuth()
  const history = useHistory()
  const location = useLocation<{ from: Location }>()

  const searchParams = React.useMemo(
    () => new URLSearchParams(location.search),
    [location],
  )

  // Guaranteed to be either register or login since those are the only routes this page should be rendered for
  const mode = location.pathname.substr(1) as 'register' | 'login'

  if (loggedIn) {
    const redirectUrl = searchParams.get('redirect_url')
    const nextUrl = redirectUrl ?? location.state?.from.pathname ?? '/dashboard'
    if (nextUrl.startsWith('/')) {
      history.replace(nextUrl)
    } else {
      // If the URL doesn't start with /, it's probably a different domain
      // in which case we have to use window.location's .replace() instead of history's
      window.location.replace(nextUrl)
    }
    return null
  }

  const infoLines =
    {
      login: [
        {
          title: 'See your network expand',
          subtitle:
            'Monitor how many taps your Nomus cards generate and watch your contact collection grow',
        },
        {
          title: 'Handle your Nomus Card orders',
          subtitle:
            'Track existing orders, reorder Nomus Cards, and view previous orders',
        },
        {
          title: 'Take control of your data',
          subtitle:
            'Edit your contact info, set preferences, and temporarily hide your public profile',
        },
      ],
      register: [
        {
          title: 'Leverage NFC technology',
          subtitle:
            'Create NFC-enabled Nomus Cards with our customizable templates or upload your own design',
        },
        {
          title: 'Activate your digital identity',
          subtitle:
            'Add your contact details to build up your sleek, unique profile and share it with people you meet',
        },
        {
          title: 'Shape a stronger network',
          subtitle:
            'Sort through your contacts easily and add meeting details, notes, and tags for each contact',
        },
      ],
    }[mode] || []

  return (
    <Box
      container
      display="flex"
      justifyContent="center"
      minHeight="100vh"
      bg="white"
      position="relative"
    >
      <Box
        // Don't show the squiggle thing in mobile
        display={{ _: 'none', [bp]: 'block' }}
        position="absolute"
        zIndex={0}
        right="0"
        top="-5%"
        height="110vh"
        width="60vw"
      >
        <Image
          src={illustration}
          w="100%"
          h="100%"
          css={css({ objectFit: 'cover', objectPosition: 'left' })}
        />
      </Box>
      <Box
        position="relative"
        zIndex={1}
        display="grid"
        gridTemplateColumns={{ _: '', [bp]: '1fr 4fr 2fr 5fr' }}
        pt="110px"
      >
        {/* Left-hand side */}
        <Box gridColumn="2/3">
          <Text.PageHeader>
            {{ login: 'Sign in', register: 'Get started' }[mode]}
          </Text.PageHeader>
          <Box mb={3} minWidth="300px">
            {
              {
                login: <LoginForm />,
                register: <RegistrationForm />,
              }[mode]
            }
          </Box>
          {
            {
              login: (
                <Text.Body2>
                  Don't have an account yet?{' '}
                  <Link to={`/register?${searchParams.toString()}`}>
                    Get started.
                  </Link>
                </Text.Body2>
              ),
              register: (
                <Text.Body2>
                  Have an account?{' '}
                  <Link to={`/login?${searchParams.toString()}`}>Sign in.</Link>
                </Text.Body2>
              ),
            }[mode]
          }
        </Box>

        {/* Right-hand side */}
        <Box
          position="relative"
          display={{ _: 'none', [bp]: 'block' }}
          height="auto"
          gridColumn="4/5"
        >
          <Image src={logoFull} mb="32px" />
          {infoLines.map((line) => (
            <Box placeSelf="start" mb={3} display="flex">
              <Box px="8px">
                <SVG.Check
                  color={colors.midnightGray}
                  css={css({ width: '32px', height: '32px' })}
                />
              </Box>
              <Box px="16px">
                <Text.SectionSubheader mb={2}>
                  {line.title}
                </Text.SectionSubheader>
                <Text.Body2>{line.subtitle}</Text.Body2>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
