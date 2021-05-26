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
import handShake from './handshake.svg'
import pointAtSky from './point-at-sky.svg'
import raiseHand from './raise-hand.svg'
import waterHose from './water-hose.svg'
import anshul from './anshul-headshot.svg'
import cindy from './cindy-headshot.svg'
import bibek from './bibek-headshot.svg'
import hanad from './hanad-headshot.svg'
import Card from 'src/components/Card'
import { cardSet } from 'src/copy/cardSet'
import threePhones from './three-phones.svg'
import peopleMeeting from './people-meeting.svg'
import nomusVideoCall from './nomus-video-call.svg'
import { Spinner } from '@chakra-ui/react'
import { mq } from 'src/styles/breakpoints'

interface FormData {
  email: string
}

const bp = 'lg'

const AboutPage = () => {
  const { register, handleSubmit, errors, formState } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email('Please enter a valid email address.'),
      }),
    ),
  })

  const onSubmit = async (data: FormData) => {
    if (data.email.trim() !== '') {
      await fetch('/api/sendgrid/interest-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email.trim(),
        }),
      })
    }
  }

  return (
    <Box overflowX="hidden" position="relative" width="100vw" height="100vh">
      <Navbar />

      {/* Nomus, in a nutshell */}
      <Box>
        {/* Top header */}
        <Box
          height={{ base: '142px', [bp]: '200px' }}
          backgroundColor="ivory"
          textAlign="center"
        >
          <Text.PageHeader
            pt={{ base: '24px', [bp]: '32px' }}
            mb={{ base: '8px', [bp]: '16px' }}
          >
            Nomus
          </Text.PageHeader>
          <Text.Body pb={{ base: '24px', [bp]: '75px' }}>
            Tap. Connect. Network with a purpose.
          </Text.Body>
        </Box>

        {/* Copy section */}
        <Box
          container
          display="grid"
          gridTemplateColumns={{ base: '1fr', [bp]: '5fr 7fr' }}
          gridTemplateAreas={{
            base: `
            "title"
            "image"
            "description"
            `,
            [bp]: `
              "title image"
              "description image"
            `,
          }}
          gridColumnGap="16px"
          mx={{ base: '24px', [bp]: '96px' }}
          pt="16px"
          pb="32px"
        >
          <Text.SectionHeader
            gridArea="title"
            mb="16px"
            textAlign={{ base: 'center', [bp]: 'left' }}
          >
            Nom(us) in a nutshell
          </Text.SectionHeader>

          <Image
            gridArea="image"
            src={peopleMeeting}
            textAlign="right"
            position="relative"
            top={{ base: '0', [bp]: '-72px' }}
            mb={{ base: '0', [bp]: '-72px' }}
            mr={{ base: '-72px', [bp]: '0' }}
            placeSelf="stretch flex-start"
            objectFit="contain"
            objectPosition="top"
            borderRadius="8px"
          />

          <Box gridArea="description" py="9px">
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
        </Box>
      </Box>

      {/* What do we care about? */}
      <Box container>
        <Text.SectionHeader
          mb="16px"
          mt={{ base: '0px', [bp]: '40px' }}
          textAlign="center"
        >
          What do we care about?
        </Text.SectionHeader>
        <Box
          display="grid"
          gridTemplateAreas={{
            base: 'repeat(12, 1fr) / repeat(12, 1fr)',
            [bp]: '1fr 2fr 1fr / 1fr 1fr 1fr 1fr',
          }}
          mx={{ base: '24px', [bp]: '96px' }}
          gridColumnGap={{ base: 2, [bp]: 3 }}
          textAlign="center"
        >
          <Text.SectionSubheader
            gridArea={{ base: '1 / 1 / 1 / 13', [bp]: '1 / 1 / 2 / 2' }}
            textAlign="center"
            mb={{ base: '8px', [bp]: '17px' }}
          >
            Our value
          </Text.SectionSubheader>
          <Text.SectionSubheader
            gridArea={{ base: '4 / 1 / 5 / 13', [bp]: '1 / 2 / 2 / 3' }}
            textAlign="center"
            mb={{ base: '8px', [bp]: '17px' }}
          >
            Doing good
          </Text.SectionSubheader>
          <Text.SectionSubheader
            gridArea={{ base: '7 / 1 / 8 / 13', [bp]: '1 / 3 / 2 / 4' }}
            textAlign="center"
            mb={{ base: '8px', [bp]: '17px' }}
          >
            Enabling great ideas
          </Text.SectionSubheader>
          <Text.SectionSubheader
            gridArea={{ base: '10 / 1 / 11 / 13', [bp]: '1 / 4 / 2 / 5' }}
            textAlign="center"
            mb={{ base: '8px', [bp]: '17px' }}
          >
            You
          </Text.SectionSubheader>
          <Image
            gridArea={{ base: '2 / 1 / 3 / 13', [bp]: '2 / 1 / 3 / 2' }}
            src={waterHose}
            textAlign="center"
            mb={{ base: '8px', [bp]: '17px' }}
          />
          <Image
            gridArea={{ base: '5 / 1 / 6 / 13', [bp]: '2 / 2 / 3 / 3' }}
            src={pointAtSky}
            textAlign="center"
            mb={{ base: '8px', [bp]: '17px' }}
          />
          <Image
            gridArea={{ base: '8 / 1 / 9 / 13', [bp]: '2 / 3 / 3 / 4' }}
            src={handShake}
            textAlign="center"
            mb={{ base: '8px', [bp]: '17px' }}
          />
          <Image
            gridArea={{ base: '11 / 1 / 12 / 13', [bp]: '2 / 4 / 3 / 5' }}
            src={raiseHand}
            textAlign="center"
            mb={{ base: '8px', [bp]: '17px' }}
          />

          <Text.Body2
            gridArea={{ base: '3 / 1 / 4 / 13', [bp]: '3 / 1 / 4 / 2' }}
            textAlign="center"
            mb={{ base: '24px', [bp]: '80px' }}
          >
            We work towards a product you're proud to use and we're proud to
            work on.
          </Text.Body2>
          <Text.Body2
            gridArea={{ base: '6 / 1 / 7 / 13', [bp]: '3 / 2 / 4 / 3' }}
            textAlign="center"
            mb={{ base: '24px', [bp]: '80px' }}
          >
            We're always asking ourselves, "what's the right thing to do here?"
            Our goal is to do business the good way.
          </Text.Body2>
          <Text.Body2
            gridArea={{ base: '9 / 1 / 10 / 13', [bp]: '3 / 3 / 4 / 4' }}
            textAlign="center"
            mb={{ base: '24px', [bp]: '80px' }}
          >
            Whether individuals or business, we believe that connecting people
            with people drives innovation.
          </Text.Body2>
          <Text.Body2
            gridArea={{ base: '12 / 1 / 13 / 13', [bp]: '3 / 4 / 4 / 5' }}
            textAlign="center"
            mb={{ base: '48px', [bp]: '80px' }}
          >
            We want you to succeed – show us who you are. We're here to listen –
            tell us how we can do better.
          </Text.Body2>
        </Box>
      </Box>

      {/* Why choose Nomus? */}
      <Box container>
        <Text.SectionHeader
          mb={{ base: '16px', [bp]: '32px' }}
          textAlign="center"
        >
          Why choose Nomus?
        </Text.SectionHeader>

        <Box
          display="grid"
          gridTemplate={{
            base: '1fr / 1fr',
            [bp]: '1fr 1fr / 1fr 1fr 1fr',
          }}
          gridGap={{ base: 2, [bp]: 3 }}
          mx={{ base: '24px', [bp]: '96px' }}
          sx={{
            '& svg': {
              width: '100%',
            },
          }}
        >
          {cardSet.map(({ header, icon, text }) => (
            <Card
              align="left"
              size="small"
              icon={icon}
              header={header}
              bodyText={text}
              boxShadow="workingWindow"
            />
          ))}
        </Box>
      </Box>

      {/* Why NFC? */}
      <Box height={{ base: '676px', [bp]: '360px' }} backgroundColor="ivory">
        <Box container>
          <Box
            display="grid"
            gridTemplateAreas={{
              base: 'repeat(4, 1fr) / repeat(12, 1fr)',
              [bp]: 'repeat(3, 1fr) / repeat(12, 1fr)',
            }}
            pt={{ base: '32px', [bp]: '64px' }}
            pb={{ base: '32px', [bp]: '74px' }}
            mx={{ base: '24px', [bp]: '96px' }}
            mt={{ base: '48px', [bp]: '98px' }}
          >
            <Text.SectionHeader
              textAlign={{ base: 'center', [bp]: 'left' }}
              gridArea={{ base: '1 / 1 / 2 / 13', [bp]: '1 / 1 / 2 / 9' }}
            >
              Why NFC?
            </Text.SectionHeader>
            <Image
              gridArea={{ base: '2 / 1 / 3 / 13', [bp]: '1 / 9 / span 3 / 13' }}
              src={threePhones}
              mb={{ base: '16px', [bp]: '64px' }}
            />

            <Text.Body2
              textAlign="left"
              gridArea={{
                base: '3 / 1 / 4 / 13',
                [bp]: '2 / 1 / 3/ 9',
              }}
              mb="16px"
            >
              Inside these business cards, there’s something that sets it apart
              from all the others – an NFC (Near Field Communication) chip. You
              might have used similar contactless payment through your credit
              card or technologies like Apple Pay.
            </Text.Body2>
            <Text.Body2
              textAlign="left"
              gridArea={{
                base: '4 / 1 / 5 / 13',
                [bp]: '3 / 1 / 4/ 9',
              }}
            >
              We're big fans of NFC. We've seen the rise to mass market adoption
              in credit cards, integration and support across devices, and we're
              ready to bring that power to networking. With Nomus, you're on the
              cutting edge of modern tech that's here to stay.
            </Text.Body2>
          </Box>
        </Box>
      </Box>

      {/* The Nomus story */}
      <Box container>
        <Box
          display="grid"
          gridTemplateAreas={{
            base: 'repeat(4, 1fr) / repeat(12, 1fr)',
            [bp]: 'repeat(3, 1fr) / repeat(12, 1fr)',
          }}
          gridColumnGap={{ base: 2, [bp]: 3 }}
          mx={{ base: '24px', [bp]: '96px' }}
          pt="16px"
        >
          <Image
            gridArea={{ base: '1 / 1 / 2 / 13', [bp]: '1 / 1 / 4 / 8' }}
            src={nomusVideoCall}
            mb={{ base: '18px', [bp]: '40px' }}
          />
          <Box
            gridArea={{ base: '2 / 1 / 5 / 13', [bp]: '1 / 8/ 4 / 13' }}
            mt={{ base: '', [bp]: '64px' }}
            mb={{ base: '48px', [bp]: '' }}
          >
            <Text.SectionHeader textAlign={{ base: 'center', [bp]: 'left' }}>
              The Nomus story
            </Text.SectionHeader>
            <Text.Body2 mb="16px">
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
      </Box>

      {/* Meet the crew */}
      <Box container>
        <Text.SectionHeader textAlign="center">
          Meet the crew
        </Text.SectionHeader>
        <Box
          display="grid"
          gridTemplateAreas={{
            base: 'repeat(16, 1fr) / 1fr',
            [bp]: '1fr 1fr 2fr 1fr / 1fr 1fr 1fr 1fr',
          }}
          mx={{ base: '24px', [bp]: '96px' }}
          pt="16px"
          gridColumnGap={{ base: 2, [bp]: 3 }}
          mb={{ base: '54px', [bp]: '80px' }}
        >
          <Text.SectionSubheader
            gridArea={{ base: '1 / 1 / 2 / 2', [bp]: '1 / 1 / 2 / 2' }}
            textAlign="center"
          >
            Anshul Aggarwal
          </Text.SectionSubheader>
          <Text.SectionSubheader
            gridArea={{ base: '5 / 1 / 6 / 2', [bp]: '1 / 2 / 2 / 3' }}
            textAlign="center"
          >
            Cindy Cheung
          </Text.SectionSubheader>
          <Text.SectionSubheader
            gridArea={{ base: '9 / 1 / 10 / 2', [bp]: '1 / 3 / 2 / 4' }}
            textAlign="center"
          >
            Bibek Ghimire
          </Text.SectionSubheader>
          <Text.SectionSubheader
            gridArea={{ base: '13 / 1 / 14 / 2', [bp]: '1 / 4 / 2 / 5' }}
            textAlign="center"
          >
            Hanad Musa
          </Text.SectionSubheader>
          <Text.Body
            gridArea={{ base: '2 / 1 / 3 / 2', [bp]: '2 / 1 / 3 / 2' }}
            textAlign="center"
          >
            Chief Executive Officer
          </Text.Body>
          <Text.Body
            gridArea={{ base: '6 / 1 / 7 / 2', [bp]: '2 / 2 / 3 / 3' }}
            textAlign="center"
          >
            Chief Design Officer
          </Text.Body>
          <Text.Body
            gridArea={{ base: '10 / 1 / 11 / 2', [bp]: '2 / 3 / 3 / 4' }}
            textAlign="center"
          >
            Chief Technical Officer
          </Text.Body>
          <Text.Body
            gridArea={{ base: '14 / 1 / 15 / 2', [bp]: '2 / 4 / 3 / 5' }}
            textAlign="center"
          >
            Chief Operations Officer
          </Text.Body>

          <Image
            gridArea={{ base: '3 / 1 / 4 / 2', [bp]: '3 / 1 / 4 / 2' }}
            src={anshul}
            mb={{ base: '8px', [bp]: '6px' }}
          />
          <Image
            gridArea={{ base: '7 / 1 / 8 / 2', [bp]: '3 / 2 / 4 / 3' }}
            src={cindy}
            mb={{ base: '8px', [bp]: '6px' }}
          />
          <Image
            gridArea={{ base: '11 / 1 / 12 / 2', [bp]: '3 / 3 / 4 / 4' }}
            src={bibek}
            mb={{ base: '8px', [bp]: '6px' }}
          />
          <Image
            gridArea={{ base: '15 / 1 / 16 / 2', [bp]: '3 / 4 / 4 / 5' }}
            src={hanad}
            mb={{ base: '8px', [bp]: '6px' }}
          />

          <Text.Body2
            gridArea={{ base: '4 / 1 / 5 / 2', [bp]: '4 / 1 / 5 / 2' }}
            textAlign="center"
          >
            A fan of overextending himself due to being passionate about people
            among a million and one things.
          </Text.Body2>
          <Text.Body2
            gridArea={{ base: '8 / 1 / 9 / 2', [bp]: '4 / 2 / 5 / 3' }}
            textAlign="center"
          >
            Counts her senior-year high school yearbook as one of her greatest
            achievements still.
          </Text.Body2>
          <Text.Body2
            gridArea={{ base: '12 / 1 / 13 / 2', [bp]: '4 / 3 / 5 / 4' }}
            textAlign="center"
          >
            Fought through months of sickness and back pain to bring Nomus into
            the world.
          </Text.Body2>
          <Text.Body2
            gridArea={{ base: '16 / 1 / 17 / 2', [bp]: '4 / 4 / 5 / 5' }}
            textAlign="center"
          >
            King of crosswords and planning “get-togethers” that are probably
            too popular for their own good.
          </Text.Body2>
        </Box>
      </Box>

      {/* Ending Footer */}
      <Box height={{ base: '328px', [bp]: '302px' }} backgroundColor="ivory">
        <Box container>
          <Box
            textAlign="center"
            display="grid"
            gridTemplateColumns={{
              base: 'repeat(12,1fr)',
              [bp]: 'repeat(12,1fr)',
            }}
            gridTemplateRows={{
              base: 'repeat(4, auto)',
              [bp]: 'repeat(3, auto)',
            }}
            mx={{ base: '24px', [bp]: '96px' }}
            pt={{ base: '32px', [bp]: '64px' }}
            pb={{ base: '48px', [bp]: '64px' }}
            gridColumnGap={{ base: 2, [bp]: 3 }}
          >
            <Text.SectionHeader
              mb="16px"
              gridRow={{ base: '1 /2', [bp]: '1/2' }}
              gridColumn="span 12"
              textAlign="center"
            >
              Moved by these four whippersnappers?
            </Text.SectionHeader>
            <Text.Body2
              mb={{ base: '16px', [bp]: '40px' }}
              gridRow={{ base: '2 /3', [bp]: '2/3' }}
              gridColumn="span 12"
              textAlign="center"
            >
              Know what’s going on with Nomus all the time and get notified when
              we make something new for you.
            </Text.Body2>

            <Box gridColumn={{ base: 'span 12', [bp]: '3 /11' }}>
              <Form.Form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  display="flex"
                  alignItems="stretch"
                  justifyContent="stretch"
                  flexDirection={{ base: 'column', [bp]: 'row' }}
                >
                  <Form.Input
                    name="email"
                    placeholder="hi@nomus.me"
                    mb={{ base: 2, [bp]: 0 }}
                    flexGrow={1}
                    sx={{
                      [mq[bp]]: {
                        borderTopRightRadius: 'none',
                        borderBottomRightRadius: 'none',
                        borderRight: 'none',
                      },
                    }}
                    ref={register({ required: true })}
                    type="email"
                    autoComplete="email"
                    error={errors.email}
                    gridRow={{ base: '3 /4', [bp]: '3/4' }}
                  />

                  <Button
                    gridRow={{ base: '4 /5', [bp]: '3/4' }}
                    sx={{
                      [mq[bp]]: {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderRight: 'none',
                      },
                    }}
                    variant="primary"
                    type="submit"
                    disabled={
                      formState.isSubmitting || formState.isSubmitSuccessful
                    }
                  >
                    <Box display="flex">
                      {formState.isSubmitting && (
                        <Box mr={2}>
                          <Spinner size="20px" />
                        </Box>
                      )}

                      {formState.isSubmitted ? (
                        <Text.Plain>Keep me updated</Text.Plain>
                      ) : (
                        <Text.Plain>You're in the loop!</Text.Plain>
                      )}
                    </Box>
                  </Button>
                </Box>
                <Form.FieldError fieldError={errors.email} />
              </Form.Form>
            </Box>

            {formState.isSubmitted && !formState.isSubmitSuccessful ? (
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
