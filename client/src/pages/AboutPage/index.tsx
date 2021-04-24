import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import * as Form from 'src/components/Form'
import Navbar from 'src/components/Navbar'
import Button from 'src/components/Button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Image from 'src/components/Image'
import hs from './hs.svg'
import pas from './pas.svg'
import rh from './rh.svg'
import wh from './wh.svg'
import aa from './aa.svg'
import cc from './cc.svg'
import bg from './bg.svg'
import hm from './hm.svg'
import Card from 'src/components/Card'
import { cardSet } from 'src/copy/cardSet'
import tp from './tp.svg'
import pm from './pm.svg'
import nvc from './nvc.svg'
import { Spinner } from '@chakra-ui/react'

interface FormData {
  email: string
}

const bp = 'lg'

const AboutPage = () => {
  const { register, handleSubmit, errors } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email('Please enter a valid email address.'),
      }),
    ),
  })
  const [submitState, setSubmitState] = React.useState<
    'unsubmitted' | 'submitting' | 'success' | 'failure'
  >('unsubmitted')

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
      <Box>
        <Box
          height={{ base: '142px', [bp]: '154px' }}
          backgroundColor="ivory"
          textAlign="center"
        >
          <Text.PageHeader pt="20px"> Nomus</Text.PageHeader>
          <Text.Body>Tap. Connect. Network with a purpose.</Text.Body>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns={{
            base: 'repeat(12, 1fr)',
            [bp]: 'repeat(12, 1fr)',
          }}
          gridColumnGap={{ base: 2, [bp]: 3 }}
          mx={{ base: '24px', [bp]: '96px' }}
          pt="16px"
          pb="32px"
        >
          <Box gridColumn={{ base: 'span 12', [bp]: '1/6' }} py="9px">
            <Text.SectionHeader mb="16px">
              Nom(us) in a nutshell
            </Text.SectionHeader>
            <Text.Body mb="4px">Our Mission Statement is simple:</Text.Body>
            <Text.Body mb="16px">
              <strong>to empower effective, human-centered business.</strong>
            </Text.Body>
            <Text.Body2>How do we do that? Glad you asked.</Text.Body2>
            <Text.Body2>
              Nomus provides custom NFC-enabled business cards to professionals
              trying to find a more effective way to connect with people. In the
              power of a single tap, our customers unlock a whole world of
              potential. Nomus enables you to engage, track, and build a network
              ready for your next awesome opportunity.
            </Text.Body2>
          </Box>
          <Image gridColumn={{ base: '', [bp]: '6 / 13' }} src={pm} />
        </Box>
        <Text.SectionHeader mb="16px" textAlign="center">
          What do we care about?
        </Text.SectionHeader>
        <Box
          py="9px"
          display="grid"
          gridTemplateAreas={{
            base: '1fr 2fr 1fr / 1fr 1fr 1fr 1fr',
            [bp]: '1fr 2fr 1fr / 1fr 1fr 1fr 1fr',
          }}
          mx={{ base: '24px', [bp]: '96px' }}
          pt="16px"
          pb="32px"
          gridColumnGap={{ base: 2, [bp]: 3 }}
        >
          <Text.SectionSubheader gridArea="1 / 1 / 2 / 2" textAlign="center">
            Our value
          </Text.SectionSubheader>
          <Text.SectionSubheader gridArea="1 / 2 / 2 / 3" textAlign="center">
            Doing good
          </Text.SectionSubheader>
          <Text.SectionSubheader gridArea="1 / 3 / 2 / 4" textAlign="center">
            Enabling great ideas
          </Text.SectionSubheader>
          <Text.SectionSubheader gridArea="1 / 4 / 2 / 5" textAlign="center">
            You
          </Text.SectionSubheader>
          <Image gridArea="2 / 1 / 3 / 2" src={wh} />
          <Image gridArea="2 / 2 / 3 / 3" src={pas} />
          <Image gridArea="2 / 3 / 3 / 4" src={hs} />
          <Image gridArea="2 / 4 / 3 / 5" src={rh} />

          <Text.Body2 gridArea="3 / 1 / 4 / 2" textAlign="center">
            We work towards a product you're proud to use and we're proud to
            work on.
          </Text.Body2>
          <Text.Body2 gridArea="3 / 2 / 4 / 3" textAlign="center">
            We're always asking ourselves, "what's the right thing to do here?"
            Our goal is to do business the good way.
          </Text.Body2>
          <Text.Body2 gridArea="3 / 3 / 4 / 4" textAlign="center">
            Whether individuals or business, we believe that connecting people
            with people drives innovation.
          </Text.Body2>
          <Text.Body2 gridArea="3 / 4 / 4 / 5" textAlign="center">
            We want you to succeed – show us who you are. We're here to listen –
            tell us how we can do better.
          </Text.Body2>
        </Box>
        <Text.SectionHeader mb="16px" textAlign="center">
          Why choose Nomus?
        </Text.SectionHeader>

        <Box
          py="9px"
          display="grid"
          gridTemplate={{
            base: '1fr / 1fr 1fr 1fr ',
            [bp]: '1fr 1fr / 1fr 1fr 1fr ',
          }}
          gridAutoRows={{
            base: '1fr',
            [bp]: '1fr',
          }}
          gridAutoFlow="row"
          mx={{ base: '24px', [bp]: '96px' }}
          pt="16px"
          pb="32px"
          gridColumnGap={{ base: 2, [bp]: 3 }}
        >
          {cardSet.map(({ header, icon, text }) => (
            <Card
              align="left"
              size="small"
              icon={icon}
              header={header}
              bodyText={text}
              boxShadow="workingWindow"
            ></Card>
          ))}
        </Box>
        <Box height={{ base: '142px', [bp]: '360px' }} backgroundColor="ivory">
          <Box
            textAlign="center"
            display="grid"
            gridTemplateColumns={{
              base: 'repeat(12, 1fr)',
              [bp]: 'repeat(12, 1fr)',
            }}
            gridColumnGap={{ base: 2, [bp]: 3 }}
            pt="16px"
            pb="32px"
            mx={{ base: '24px', [bp]: '96px' }}
          >
            <Box
              gridColumn={{ base: '1/ 9', [bp]: '1 / 9' }}
              textAlign="left"
              pt="20px"
            >
              <Text.SectionHeader>Why NFC?</Text.SectionHeader>

              <Text.Body2>
                Inside these business cards, there’s something that sets it
                apart from all the others – an NFC (Near Field Communication)
                chip. You might have used similar contactless payment through
                your credit card or technologies like Apple Pay.
              </Text.Body2>
              <Text.Body2>
                We're big fans of NFC. We've seen the rise to mass market
                adoption in credit cards, integration and support across
                devices, and we're ready to bring that power to networking. With
                Nomus, you're on the cutting edge of modern tech that's here to
                stay.
              </Text.Body2>
            </Box>
            <Image gridColumn={{ base: '9 / 13', [bp]: '9 / 13' }} src={tp} />
          </Box>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns={{
            base: 'repeat(12, 1fr)',
            [bp]: 'repeat(12, 1fr)',
          }}
          gridColumnGap={{ base: 2, [bp]: 3 }}
          mx={{ base: '24px', [bp]: '96px' }}
          pt="16px"
          pb="32px"
        >
          <Image gridColumn={{ base: '', [bp]: '1 / 8' }} src={nvc} />
          <Box gridColumn={{ base: 'span 12', [bp]: '8/13' }} py="9px">
            <Text.SectionHeader mb="16px">The Nomus story</Text.SectionHeader>
            <Text.Body2>
              Nomus began with four young whippersnappers, eager to figure out a
              better way to do more – without compromising the values we care
              about. Our goal: figure out a way for people to amplify their
              individuality while building a supportive community. And so our
              journey continues.
            </Text.Body2>
            <Text.Body2>
              Our name Nomus stems from Latin inspiration. "Nom," meaning name,
              represents the individual. "Us" represents community. Together,
              Nomus represents our dedication for people working together to get
              more done. Simple.
            </Text.Body2>
          </Box>
        </Box>
        <Text.SectionHeader textAlign="center">
          {' '}
          Meet the crew
        </Text.SectionHeader>
        <Box
          py="9px"
          display="grid"
          gridTemplateAreas={{
            base: '1fr 1fr 2fr 1fr / 1fr 1fr 1fr 1fr',
            [bp]: '1fr 1fr 2fr 1fr / 1fr 1fr 1fr 1fr',
          }}
          mx={{ base: '24px', [bp]: '96px' }}
          pt="16px"
          pb="32px"
          gridColumnGap={{ base: 2, [bp]: 3 }}
        >
          <Text.SectionSubheader gridArea="1 / 1 / 2 / 2" textAlign="center">
            Anshul Aggarwal
          </Text.SectionSubheader>
          <Text.SectionSubheader gridArea="1 / 2 / 2 / 3" textAlign="center">
            Cindy Cheung
          </Text.SectionSubheader>
          <Text.SectionSubheader gridArea="1 / 3 / 2 / 4" textAlign="center">
            Bibek Ghimire
          </Text.SectionSubheader>
          <Text.SectionSubheader gridArea="1 / 4 / 2 / 5" textAlign="center">
            Hanad Musa
          </Text.SectionSubheader>
          <Text.Body gridArea="2 / 1 / 3 / 2" textAlign="center">
            Chief Executive Officer
          </Text.Body>
          <Text.Body gridArea="2 / 2 / 3 / 3" textAlign="center">
            Chief Design Officer
          </Text.Body>
          <Text.Body gridArea="2 / 3 / 3 / 4" textAlign="center">
            Chief Technical Officer
          </Text.Body>
          <Text.Body gridArea="2 / 4 / 3 / 5" textAlign="center">
            Chief Operations Officer
          </Text.Body>

          <Image gridArea="3 / 1 / 4 / 2" src={aa} />
          <Image gridArea="3 / 2 / 4 / 3" src={cc} />
          <Image gridArea="3 / 3 / 4 / 4" src={bg} />
          <Image gridArea="3 / 4 / 4 / 5" src={hm} />

          <Text.Body2 gridArea="4 / 1 / 5 / 2" textAlign="center">
            A fan of overextending himself due to being passionate about people
            among a million and one things.
          </Text.Body2>
          <Text.Body2 gridArea="4 / 2 / 5 / 3" textAlign="center">
            Counts her senior-year high school yearbook as one of her greatest
            achievements still.
          </Text.Body2>
          <Text.Body2 gridArea="4 / 3 / 5 / 4" textAlign="center">
            Fought through months of sickness and back pain to bring Nomus into
            the world.
          </Text.Body2>
          <Text.Body2 gridArea="4 / 4 / 5 / 5" textAlign="center">
            King of crosswords and planning “get-togethers” that are probably
            too popular for their own good.
          </Text.Body2>
        </Box>
        <Box height={{ base: '142px', [bp]: '302px' }} backgroundColor="ivory">
          <Box
            textAlign="center"
            display="grid"
            gridTemplateColumns={{ base: '', [bp]: 'repeat(12,1fr)' }}
            // gridRow={{ base: '', [bp]: '1fr 1fr 2fr' }}
            mx={{ base: '24px', [bp]: '96px' }}
            pt="16px"
            pb="32px"
            gridColumnGap={{ base: 2, [bp]: 3 }}
            py="9px"
          >
            <Box
              gridColumn="span 12"
              textAlign="center"
              // gridRow= "1 / 2"
            >
              <Text.SectionHeader pt="20px">
                Moved by these four whippersnappers?
              </Text.SectionHeader>
              <Text.Body2 mb="40px">
                Know what’s going on with Nomus all the time and get notified
                when we make something new for you.
              </Text.Body2>
            </Box>
            <Box gridColumn="3 /11">
              <Form.Form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  display="flex"
                  // flexDirection={{ base: 'column', [bp]: 'row' }}
                  alignItems="stretch"
                  justifyContent="stretch"
                >
                  <Form.Input
                    name="email"
                    placeholder="hi@nomus.me"
                    mb={{ base: 2, [bp]: 0 }}
                    flexGrow={1}
                    sx={{
                      [bp]: {
                        borderTopRightRadius: 'none',
                        borderBottomRightRadius: 'none',
                        borderRight: 'none',
                      },
                    }}
                    ref={register({ required: true })}
                    type="email"
                    autoComplete="email"
                    error={errors.email}
                  />
                  <Button
                    sx={{
                      [bp]: {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderRight: 'none',
                      },
                    }}
                    variant="primary"
                    type="submit"
                    disabled={
                      submitState === 'unsubmitted' ||
                      submitState === 'submitting'
                        ? false
                        : true
                    }
                  >
                    <Box
                      display="flex"
                      // flexDirection="row"
                      // alignItems="center"
                      // justifyContent="center"
                    >
                      {submitState === 'submitting' && (
                        <Box mr={2}>
                          <Spinner size="20px" />
                        </Box>
                      )}

                      {submitState === 'unsubmitted' ||
                      submitState === 'submitting' ? (
                        <Text.Plain>Keep me updated</Text.Plain>
                      ) : (
                        <Text.Plain>You're in the loop!</Text.Plain>
                      )}
                    </Box>
                  </Button>
                  <Form.FieldError fieldError={errors.email} />
                </Box>
              </Form.Form>
            </Box>

            {submitState === 'failure' ? (
              <Box mt="16px">
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
      </Box>
    </Box>
  )
}

export default AboutPage
