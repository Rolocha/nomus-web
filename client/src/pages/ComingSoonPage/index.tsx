import { yupResolver } from '@hookform/resolvers/yup'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Form from 'src/components/Form'
import Image from 'src/components/Image'
import Navbar from 'src/components/Navbar'
import Spinner from 'src/components/Spinner'
import * as Text from 'src/components/Text'
import { mq, useBreakpoint } from 'src/styles/breakpoints'
import * as yup from 'yup'
import background from './background.svg'
import coffeeCupIllustration from './coffee-cup-illustration.svg'
interface FormData {
  email: string
}

const bp = 'lg'

const ComingSoonPage = () => {
  const { register, handleSubmit, formState } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
      }),
    ),
  })
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
      <Navbar />
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
        backgroundSize={{ base: '200% auto', [bp]: '100%' }}
        backgroundPosition={{ base: '75% bottom', [bp]: 'bottom' }}
        backgroundRepeat="no-repeat"
      />
      <Box
        px={{ base: '24px', [bp]: '96px' }}
        position="relative"
        mt={{ base: '70px', [bp]: '120px' }}
        display="grid"
        gridTemplateColumns={{
          base: '2fr 4fr 4fr 2fr',
          [bp]: '2fr 3fr 3fr 4fr',
        }}
        gridTemplateAreas={{
          base: `
            ". copy copy ."
            ". . coffeeCup coffeeCup"
          `,
          [bp]: `
          ". . . coffeeCup"
          ". copy copy coffeeCup"
          `,
        }}
        gridColumnGap={{ base: 2, [bp]: 3 }}
      >
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
                flexDirection={{ base: 'column', [bp]: 'row' }}
                alignItems="stretch"
                justifyContent="stretch"
              >
                <Form.Input
                  name="email"
                  placeholder="hi@nomus.me"
                  mb={{ base: 2, [bp]: 0 }}
                  ref={register}
                  disabled={submitState === 'submitting'}
                  flexGrow={1}
                  sx={{
                    [mq[bp]]: {
                      borderTopRightRadius: 'none',
                      borderBottomRightRadius: 'none',
                      borderRight: 'none',
                    },
                  }}
                />
                <Button
                  sx={{
                    [mq[bp]]: {
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderRight: 'none',
                    },
                  }}
                  variant="primary"
                  type="submit"
                  disabled={submitState === 'submitting' || !formState.isValid}
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

        <Box gridArea="coffeeCup" placeSelf="end start">
          <Image
            h={{ base: '200px', [bp]: 'unset' }}
            w={{ [bp]: '100%' }}
            src={coffeeCupIllustration}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ComingSoonPage
