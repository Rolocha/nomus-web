import { css } from '@emotion/core'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Spinner from 'src/components/Spinner'
import * as Form from 'src/components/Form'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import { mq, useBreakpoint } from 'src/styles/breakpoints'
import background from './background.svg'
import coffeeCupIllustration from './coffee-cup-illustration.svg'
import nomusLogoIcon from './nomus-logo-icon.svg'
import nomusLogoText from './nomus-logo-text.svg'

interface FormData {
  email: string
}

const bp = 'lg'

const ComingSoonPage = () => {
  const { register, handleSubmit } = useForm<FormData>()
  const [submitState, setSubmitState] = React.useState<
    'unsubmitted' | 'submitting' | 'success' | 'failure'
  >('unsubmitted')

  const isDesktop = useBreakpoint(bp)

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

  return (
    <Box overflowX="hidden" position="relative" width="100vw" height="100vh">
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        backgroundImage={`url(${background})`}
        backgroundSize={{ _: '200% auto', [bp]: '100%' }}
        backgroundPosition={{ _: '75% bottom', [bp]: 'bottom' }}
        backgroundRepeat="no-repeat"
      />
      <Box
        px={{ _: '24px', [bp]: '96px' }}
        position="relative"
        mt={{ _: '70px', [bp]: '120px' }}
        display="grid"
        gridTemplateColumns={{
          _: '2fr 4fr 4fr 2fr',
          [bp]: '2fr 3fr 3fr 4fr',
        }}
        gridTemplateAreas={{
          _: `
            "logoIcon logoText . ."
            ". copy copy ."
            ". . coffeeCup coffeeCup"
          `,
          [bp]: `
          "logoIcon logoText . coffeeCup"
          ". copy copy coffeeCup"
          `,
        }}
        gridColumnGap={{ _: 2, [bp]: 3 }}
      >
        <Box gridArea="logoIcon" placeSelf="end">
          <Image h={{ _: '48px', [bp]: 'unset' }} src={nomusLogoIcon} />
        </Box>

        <Box gridArea="logoText" placeSelf="center start">
          <Image h={{ _: '18px', [bp]: 'unset' }} src={nomusLogoText} />
        </Box>

        <Box gridArea="copy">
          {isDesktop ? (
            <Text.PageHeader mb={3}>Something awesome brewing</Text.PageHeader>
          ) : (
            <Text.SectionHeader mb={3}>
              Something awesome brewing
            </Text.SectionHeader>
          )}

          <Text.Body mb={3}>
            Something that’ll let you unlock the power of NFC for networking. In
            the meantime, drop your email to be the first to access Nomus when
            we release.
          </Text.Body>

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
                  variant="primary"
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
                        <Spinner size={20} />
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

        <Box gridArea="coffeeCup" placeSelf="end start">
          <Image
            h={{ _: '200px', [bp]: 'unset' }}
            w={{ [bp]: '100%' }}
            src={coffeeCupIllustration}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ComingSoonPage
