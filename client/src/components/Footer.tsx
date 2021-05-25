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
    <Box bg={colorPalette.background} py={{ base: '40px', [bp]: '70px' }}>
      <Box container>
        <Box
          display="flex"
          flexDirection={{ base: 'column', [bp]: 'row' }}
          alignItems={{ base: 'flex-start', [bp]: 'center' }}
          justifyContent={{ base: 'flex-start', [bp]: 'space-between' }}
        >
          <SVG.LogoWithText color={colorPalette.accent} />
          <Text.Body
            ml={{ base: 0, [bp]: 3 }}
            mt={{ base: 3, [bp]: 0 }}
            color={colorPalette.accent}
          >
            Tap. Connect. Network with a purpose.
          </Text.Body>
        </Box>

        <Box
          my={4}
          display="grid"
          gridTemplateColumns={{ base: '1fr', [bp]: '1fr 1fr' }}
          gridColumnGap={4}
          gridRowGap={4}
        >
          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr">
            <Box>
              <Text.Label color={colors.africanElephant}>MAIN</Text.Label>
              <Link to="/">
                <Text.Body2 color={colorPalette.accent}>Home</Text.Body2>
              </Link>
              <Link to="/about">
                <Text.Body2 color={colorPalette.accent}>About</Text.Body2>
              </Link>
              <Link to="/faq">
                <Text.Body2 color={colorPalette.accent}>FAQ</Text.Body2>
              </Link>
            </Box>
            <Box>
              <Text.Label color={colors.africanElephant}>CARDS</Text.Label>
              <Link to="/shop">
                <Text.Body2 color={colorPalette.accent}>Shop</Text.Body2>
              </Link>
              <Link to="/card-studio/template">
                <Text.Body2 color={colorPalette.accent}>Nomus cards</Text.Body2>
              </Link>
              <Link to="/card-studio/custom">
                <Text.Body2 color={colorPalette.accent}>
                  Custom cards
                </Text.Body2>
              </Link>
            </Box>
          </Box>
          <Box placeSelf="end stretch">
            <Text.Body2 color={colorPalette.basicText} mb={2}>
              Get updates about all things Nomus right to your inbox.
            </Text.Body2>
            {submitState === 'unsubmitted' || submitState === 'submitting' ? (
              <Form.Form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', [bp]: 'row' }}
                  alignItems="stretch"
                  justifyContent="stretch"
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
          flexDirection={{ base: 'column', [bp]: 'row' }}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Link to="mailto:support@nomus.me">
            <Text.Body2 color={colorPalette.accent}>
              support@nomus.me
            </Text.Body2>
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
        <Box my={4} height="1px" width="100%" bg={colors.africanElephant} />

        {/* Legal info row */}
        <Box
          display="flex"
          flexDirection={{ base: 'column', [bp]: 'row' }}
          alignItems={{ base: 'flex-start', [bp]: 'center' }}
          justifyContent="space-between"
          textAlign={{ base: 'left', [bp]: 'left' }}
        >
          <Text.Body2 color={colorPalette.basicText}>
            {`© ${new Date().getFullYear()} Nomus, Inc.`}{' '}
            {isBp ? ' / ' : <br />}{' '}
            {`Registered in the United States of America`}
          </Text.Body2>

          <Box
            display="flex"
            flexDirection="row"
            mt={{ base: 4, [bp]: 'unset' }}
          >
            <Link to="/terms-of-service">
              <Text.Body2 color={colorPalette.accent} mr={3}>
                Terms of service
              </Text.Body2>
            </Link>
            <Link to="/privacy-policy">
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
