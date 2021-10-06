import * as React from 'react'
import { useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Link from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { mq, useBreakpoint } from 'src/styles/breakpoints'
import Icon from './Icon'

interface FormData {
  email: string
}

interface Props {
  colorScheme?: 'light' | 'dark'
}

const bp = 'lg'

const Footer = ({ colorScheme = 'dark' }: Props) => {
  const isBp = useBreakpoint(bp)
  const { register, handleSubmit } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (data.email.trim() !== '') {
      setSubmitState('submitting')
      const response = await fetch('/api/sendgrid/interest-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
        }),
      })

      setSubmitState(response.status === 200 ? 'success' : 'failure')
    }
  }

  const colorPalette = {
    light: {
      background: colors.white,
      accent: colors.nomusBlue,
      basicText: colors.midnightGray,
    },
    dark: {
      background: colors.nomusBlue,
      accent: colors.white,
      basicText: colors.white,
    },
  }[colorScheme]

  const [submitState, setSubmitState] = React.useState<
    'unsubmitted' | 'submitting' | 'success' | 'failure'
  >('unsubmitted')
  return (
    <Box bg={colorPalette.background} py={{ base: '24px', [bp]: '80px' }}>
      <Box container>
        <Box
          display="grid"
          gridTemplateColumns={{
            base: 'repeat(4,1fr)',
            [bp]: 'repeat(12,1fr)',
          }}
          gridTemplateRows={{
            base: 'repeat(2,1fr)',
            [bp]: '1fr',
          }}
          gridColumnGap={'22px'}
          alignItems="center"
        >
          <Box
            gridColumn="span 2"
            alignItems="start"
            gridRow="1/2"
            justifyItems="start"
          >
            <SVG.LogoWithText color={colorPalette.accent} />
          </Box>
          <Text.Body
            gridColumn={{ base: '1 / 5', [bp]: '3 / 13' }}
            gridRow={{ base: '2 / 3', [bp]: '1 / 2' }}
            // ml={{ base: '0px', [bp]: '22px' }}
            mt={{ base: '8px', [bp]: '0px' }}
            color={colorPalette.basicText}
            position={{ base: '', [bp]: 'relative' }}
            top={{ base: '0px', [bp]: '6px' }}
          >
            Tap. Connect. Network with a purpose.
          </Text.Body>
        </Box>

        <Box
          mt={{ base: '24px', [bp]: '32px' }}
          display="grid"
          gridTemplateColumns={{
            base: 'repeat(4,1fr)',
            [bp]: 'repeat(12,1fr)',
          }}
          gridColumnGap={'22px'}
          gridRowGap={4}
        >
          <Box display="flex" flexDirection="column" gridColumn="1 / 2">
            <Text.Label color={colors.africanElephant}>MAIN</Text.Label>
            <Link to="/" mt={{ base: '5px', [bp]: '8px' }}>
              <Text.Body color={colorPalette.accent}>Home</Text.Body>
            </Link>
            <Link to="/about" mt={{ base: '8px', [bp]: '8px' }}>
              <Text.Body color={colorPalette.accent}>About</Text.Body>
            </Link>
            <Link to="/faq" mt={{ base: '8px', [bp]: '8px' }}>
              <Text.Body color={colorPalette.accent}>FAQ</Text.Body>
            </Link>
          </Box>
          <Box
            gridColumn={{ base: '2 / 5', [bp]: '3 / 6' }}
            display="flex"
            flexDirection="column"
          >
            <Text.Label color={colors.africanElephant}>SHOP</Text.Label>
            <Link to="/shop" mt={{ base: '5px', [bp]: '8px' }}>
              <Text.Body color={colorPalette.accent}>Shop front</Text.Body>
            </Link>
            <Link to="/card-studio/template" mt={{ base: '8px', [bp]: '8px' }}>
              <Text.Body color={colorPalette.accent}>
                Build a card from a template
              </Text.Body>
            </Link>
            <Link to="/card-studio/custom" mt={{ base: '8px', [bp]: '8px' }}>
              <Text.Body color={colorPalette.accent}>
                Build a card from your design
              </Text.Body>
            </Link>
          </Box>

          <Box
            display="grid"
            gridColumn={{ base: '1 / 5', [bp]: '7 / 13' }}
            placeSelf="end stretch"
            mt={{ base: '24px', [bp]: '0px' }}
          >
            <Text.Body2 color={colorPalette.basicText}>
              Get updates about all things Nomus right to your inbox.
            </Text.Body2>
            {submitState === 'unsubmitted' || submitState === 'submitting' ? (
              <Form.Form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', [bp]: 'row' }}
                  alignItems="stretch"
                  justifyContent="stretch"
                  mt={{ base: '8px', [bp]: '24px' }}
                >
                  <Form.Input
                    name="email"
                    placeholder="hi@nomus.me"
                    ref={register}
                    disabled={submitState === 'submitting'}
                    flexGrow={1}
                    sx={{
                      [mq[bp]]: {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        borderRight: 'none',
                      },
                    }}
                  />
                  <Button
                    mt={{ base: 2, [bp]: 0 }}
                    sx={{
                      [mq[bp]]: {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      },
                    }}
                    variant="primary"
                    type="submit"
                    disabled={submitState === 'submitting'}
                    isLoading={submitState === 'submitting'}
                  >
                    Sign me up
                  </Button>
                </Box>
              </Form.Form>
            ) : null}

            {submitState === 'success' ? (
              <Box>
                <Text.Body>You're all set!</Text.Body>
              </Box>
            ) : null}

            {submitState === 'failure' ? (
              <Box>
                <Text.Body>
                  Uh oh, something went wrong on our end!{' '}
                  <span role="img" aria-label="upset face">
                    😣
                  </span>
                </Text.Body>
              </Box>
            ) : null}
          </Box>
        </Box>

        {/* Contact info row */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mt={{ base: '24px', [bp]: '48px' }}
          mb={{ base: '24px', [bp]: '40px' }}
        >
          <Link to="mailto:hi@nomus.me">
            <Text.Body2 color={colorPalette.accent}>hi@nomus.me</Text.Body2>
          </Link>
          <Box display="flex" px={-1} mt={{ base: 2, [bp]: 0 }}>
            {([
              {
                iconName: 'facebook',
                link: 'https://www.facebook.com/Nomus-110290254018786',
              },
              { iconName: 'twitter', link: 'https://twitter.com/nomusme' },
              { iconName: 'instagram', link: 'https://instagram.com/nomus.me' },
            ] as const).map(({ iconName, link }) => (
              <Link key={link} to={link}>
                <Box
                  mx={1}
                  borderRadius="100%"
                  bg={colorPalette.accent}
                  width="40px"
                  height="40px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Icon of={iconName} color={colorPalette.background} />
                </Box>
              </Link>
            ))}
          </Box>
        </Box>

        {/* Separator */}
        <Box height="1px" width="100%" bg={colors.africanElephant} />

        {/* Legal info row */}
        <Box
          display="flex"
          flexDirection={{ base: 'column', [bp]: 'row' }}
          alignItems={{ base: 'flex-start', [bp]: 'center' }}
          justifyContent="space-between"
          textAlign={{ base: 'left', [bp]: 'left' }}
          mt={{ base: '24px', [bp]: '45px' }}
        >
          <Text.Body2 color={colorPalette.basicText}>
            {`© ${new Date().getFullYear()} Nomus, Inc.`}{' '}
            {isBp ? ' / ' : <br />}{' '}
            {`Registered in the United States of America`}
          </Text.Body2>

          <Box
            display="flex"
            flexDirection="row"
            mt={{ base: '24px', [bp]: '0px' }}
          >
            <Link to="/terms-of-service" target="_blank">
              <Text.Body2 color={colorPalette.accent} mr={'32px'}>
                Terms of service
              </Text.Body2>
            </Link>
            <Link to="/privacy-policy" target="_blank">
              <Text.Body2 color={colorPalette.accent}>
                Privacy policy
              </Text.Body2>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer
