import { css } from '@emotion/core'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Container from 'src/components/Container'
import * as Form from 'src/components/Form'
import Link from 'src/components/Link'
import Spinner from 'src/components/Spinner'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { mq } from 'src/styles/breakpoints'
import { ABOUT_PAGE_NOTION_LINK, FAQ_PAGE_NOTION_LINK } from 'src/constants'

interface FormData {
  email: string
}

const bp = 'lg'

const Footer = () => {
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

  const [submitState, setSubmitState] = React.useState<
    'unsubmitted' | 'submitting' | 'success' | 'failure'
  >('unsubmitted')
  return (
    <Box bg={colors.nomusBlue} py={{ _: '40px', [bp]: '70px' }}>
      <Container>
        <Box
          display="flex"
          alignItems="center"
          flexDirection={{ _: 'column', [bp]: 'row' }}
        >
          <SVG.LogoWithText color={colors.white} />
          <Text.Body
            ml={{ _: 0, [bp]: 3 }}
            mt={{ _: 3, [bp]: 0 }}
            color={colors.white}
          >
            Tap. Connect. Network with a purpose.
          </Text.Body>
        </Box>

        <Box
          my={4}
          display="grid"
          gridTemplateColumns={{ _: '1fr', [bp]: '1fr 1fr' }}
          gridColumnGap={4}
          gridRowGap={4}
        >
          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr">
            <Box>
              <Text.Label color={colors.white}>MAIN</Text.Label>
              <Link to="/">
                <Text.Body2 color={colors.white}>Home</Text.Body2>
              </Link>
              <Link to={ABOUT_PAGE_NOTION_LINK}>
                <Text.Body2 color={colors.white}>About</Text.Body2>
              </Link>
              <Link to={FAQ_PAGE_NOTION_LINK}>
                <Text.Body2 color={colors.white}>FAQ</Text.Body2>
              </Link>
            </Box>
          </Box>
          <Box placeSelf="end stretch">
            <Text.Body2 color={colors.white} mb={2}>
              Get updates about all things Nomus right to your inbox.
            </Text.Body2>
            {submitState === 'unsubmitted' || submitState === 'submitting' ? (
              <Form.Form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  display="flex"
                  flexDirection={{ _: 'column', [bp]: 'row' }}
                  alignItems="stretch"
                  justifyContent="stretch"
                >
                  <Form.Input
                    name="email"
                    placeholder="hi@nomus.me"
                    mb={{ _: 2, [bp]: 0 }}
                    ref={register}
                    disabled={submitState === 'submitting'}
                    css={css`
                      flex-grow: 1;
                      ${mq[bp]} {
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                        border-right: none;
                      }
                    `}
                  />
                  <Button
                    css={css`
                      ${mq[bp]} {
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                      }
                    `}
                    variant="primaryGold"
                    type="submit"
                    disabled={submitState === 'submitting'}
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {submitState === 'submitting' && (
                        <Box mr={2}>
                          <Spinner size="20px" />
                        </Box>
                      )}
                      <Text.Plain>Sign me up</Text.Plain>
                    </Box>
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
          flexDirection={{ _: 'column', [bp]: 'row' }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Link to="mailto:support@nomus.me">
            <Text.Body2 color={colors.white}>support@nomus.me</Text.Body2>
          </Link>
          <Box display="flex" px={-1} mt={{ _: 2, [bp]: 0 }}>
            {([
              {
                Icon: SVG.Facebook,
                link: 'https://www.facebook.com/Nomus-110290254018786',
              },
              { Icon: SVG.Twitter, link: 'https://twitter.com/nomusme' },
              { Icon: SVG.Instagram, link: 'https://instagram.com/nomus.me' },
            ] as const).map(({ Icon, link }) => (
              <Link key={link} to={link}>
                <Box
                  mx={1}
                  borderRadius="100%"
                  bg="white"
                  width="40px"
                  height="40px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Icon color={colors.nomusBlue} />
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
          flexDirection={{ _: 'column', [bp]: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          textAlign={{ _: 'center', [bp]: 'left' }}
        >
          <Text.Body2
            color={colors.white}
          >{`© ${new Date().getFullYear()} Nomus, Inc.  /  Registered in the United States of America`}</Text.Body2>

          <Box display="flex" flexDirection="row" mt={{ _: 4, [bp]: 'unset' }}>
            <Text.Body2 color="white" mr={3}>
              Terms of service
            </Text.Body2>
            <Text.Body2 color="white">Privacy policy</Text.Body2>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
