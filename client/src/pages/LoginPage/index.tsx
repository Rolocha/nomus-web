import { css } from '@emotion/core'
import * as React from 'react'
import { useLocation } from 'react-router-dom'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import logoFull from 'src/images/nomus-logo-full.svg'
import { colors } from 'src/styles'
import LoginForm from './LoginForm'
import registrationSwoosh from './registration-swoosh.svg'
import RegistrationForm from './RegistrationForm'
import signInSwoosh from './sign-in-swoosh.svg'

const bp = 'lg'

const LoginPage = () => {
  const location = useLocation<{ from: Location }>()

  // Guaranteed to be either register or login since those are the only routes this page should be rendered for
  const mode = location.pathname.substr(1) as 'register' | 'login'

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
        width={{ login: '60vw', register: '65vw' }[mode]}
      >
        <Image
          src={{ login: signInSwoosh, register: registrationSwoosh }[mode]}
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
        <Box gridColumn="2/3" minWidth="300px">
          {
            {
              login: <LoginForm />,
              register: <RegistrationForm />,
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
          <Box
            display="grid"
            gridTemplateColumns="60px 4fr"
            gridRowGap="24px"
            gridColumnGap="8px"
          >
            {infoLines.map((line) => [
              <Box px="8px" key="check" placeSelf="start end">
                <SVG.Check
                  color={colors.midnightGray}
                  css={css({ width: '32px', height: '32px' })}
                />
              </Box>,
              <Box key="content">
                <Text.SectionSubheader mb={2}>
                  {line.title}
                </Text.SectionSubheader>
                <Text.Body2>{line.subtitle}</Text.Body2>
              </Box>,
            ])}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
