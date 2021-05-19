import * as React from 'react'
import { css } from '@emotion/react'

import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import * as Form from 'src/components/Form'
import Navbar from 'src/components/Navbar'
import { colors } from 'src/styles'
import Button from 'src/components/Button'
import Icon from 'src/components/Icon'
import TemplateCard from 'src/components/TemplateCard'
import Footer from 'src/components/Footer'
import Link from 'src/components/Link'
import { TemplateOptionsType } from 'src/templates'
import TestimonialCard from './TestimonialCard'
import CrewMemberCell from './CrewMemberCell'
import PromiseItem from './PromiseItem'

import heroBg from './images/hero-bg.png'
import heroCurvyFilter from './images/hero-curvy-filter.svg'
import seamlessExperienceImage from './images/seamless-experience.svg'
import humanServiceImage from './images/human-service.svg'
import qualityYouCanTrustImage from './images/quality-you-can-trust.svg'
import freeShippingImage from './images/free-shipping.svg'
import professionalCardsImage from './images/professional-cards.png'
import contactInfoPageImage from './images/contact-info-page.png'
import cardCustomBg from 'src/images/card-custom-promo-bg.png'
import wavyLoopImage from './images/wavy-loop.svg'
import dividerWave1 from './images/divider-wave-1.svg'
import dividerWave2 from './images/divider-wave-2.svg'
import dividerWave3 from './images/divider-wave-3.svg'
import contactRollImage from './images/contact-roll.png'
import testimonialBg from './images/testimonial-bg.svg'

import anshulImage from './images/anshul.png'
import hanadImage from './images/hanad.png'
import cindyImage from './images/cindy.png'
import bibekImage from './images/bibek.png'
import footerIllustration from './images/footer-illustration.svg'

const ivoryGradientBg = `linear-gradient(180deg, ${colors.ivory} 70%, ${colors.white} 100%)`

const LandingPage = () => {
  const [userEnteredName, setUserEnteredName] = React.useState('')

  const sampleCardOptions: TemplateOptionsType<'velia'> = React.useMemo(
    () => ({
      colorScheme: {
        background: colors.white,
        accent: colors.nomusBlue,
        text: colors.midnightGray,
      },
      contactInfo: {
        name: userEnteredName,
        headline: 'Chief of Everything',
        line1: '(555)-555-5555',
        line2: 'yourname@email.com',
        line3: 'Company, LLC',
      },
      omittedContactInfoFields: ['footer'],
      graphic: {
        url: '',
      },
      qrCodeUrl: 'https://nomus.me',
    }),
    [userEnteredName],
  )

  return (
    <Box overflowX="hidden" position="relative" zIndex={0}>
      <Navbar />

      {/* Hero */}
      <Box
        position="relative"
        bg={`url(${heroBg})`}
        height="min(85vh, 800px)"
        backgroundSize="cover"
        backgroundPosition="bottom"
      >
        <Image
          src={heroCurvyFilter}
          width="65vw"
          minHeight="calc(100% - 100px)"
          position="absolute"
          bottom="100px"
          left={0}
        />
        <Box container position="absolute" top={0} left={0}>
          <Box width="45%" mt="72px">
            <Text.H1 color={colors.nomusBlue} mb="24px" fontWeight="300">
              Tap. Connect. Network with purpose.
            </Text.H1>
            <Text.Body>
              Get your own personalized contactless card complete with the Nomus
              digital product, built for accessing, managing, and expanding your
              network.
            </Text.Body>
            <Box mt="24px" display="flex" alignItems="center">
              <Box mr="16px">
                <Link to="/shop">
                  <Button
                    variant="golden"
                    size="big"
                    rightIcon={<Icon of="arrowRight" />}
                  >
                    Customize your card
                  </Button>
                </Link>
              </Box>
              <Link to="/register">
                <Button variant="tertiary">Sign up</Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Our promises to you */}
      <Box container mt="40px">
        <Text.H1 color={colors.nomusBlue} mb="24px" fontWeight="300">
          Our promises to you
        </Text.H1>
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gridColumnGap="16px"
        >
          <PromiseItem
            title="Seamless experience"
            description="From tapping your card to using our website, we keep it stress-free."
            imageSrc={seamlessExperienceImage}
          />
          <PromiseItem
            title="Human-to-human service"
            description="No bots will be answering your questions. Just us."
            imageSrc={humanServiceImage}
          />
          <PromiseItem
            title="Free shipping to your door"
            description="Who wants to pay for delivery these days? Not us."
            imageSrc={freeShippingImage}
          />
          <PromiseItem
            title="Quality you can trust"
            description="We can tell you about all the trials we went through to get you the best."
            imageSrc={qualityYouCanTrustImage}
          />
        </Box>
      </Box>

      {/* Professional, tappable cards */}
      <Box
        container
        display="grid"
        gridTemplateColumns="7fr 5fr"
        gridColumnGap="16px"
        mt="80px"
      >
        <Image objectFit="cover" src={professionalCardsImage} />
        <Box px="24px" py="48px">
          <Text.H1 color={colors.nomusBlue} mb="24px" fontWeight="300">
            Professional, tappable cards
          </Text.H1>
          <Text.Body mb="24px">
            Inside these business cards, there’s something that sets it apart
            from all the others – an NFC (near-field communication) chip. With
            the tap of your new business card to the back of a smartphone, share
            your personal contact page digitally.
          </Text.Body>
          <Link to="/shop">
            <Button
              variant="golden"
              size="big"
              rightIcon={<Icon of="arrowRight" />}
            >
              Get a card
            </Button>
          </Link>
        </Box>
      </Box>

      <Image w="100%" src={dividerWave1} />

      {/* Your identity, wherever you go */}
      <Box pt="80px" bg={ivoryGradientBg}>
        <Box
          container
          display="grid"
          gridTemplateColumns="5fr 7fr"
          gridColumnGap="16px"
        >
          <Box p="24px">
            <Text.H1 color={colors.nomusBlue} mb="24px" fontWeight="300">
              Your identity, wherever you go.
            </Text.H1>
            <Text.Body mb="24px">
              Connect once, and your contacts can revisit your digital identity
              whenever, wherever. Start leaving stronger, more memorable
              impressions.
            </Text.Body>
            <Link to="/register">
              <Button
                variant="golden"
                size="big"
                rightIcon={<Icon of="arrowRight" />}
              >
                Create your profile
              </Button>
            </Link>
          </Box>
          <Image objectFit="cover" src={contactInfoPageImage} />
        </Box>
      </Box>

      {/* Mini card builder */}
      <Box
        container
        display="grid"
        gridTemplateColumns="7fr 5fr"
        gridColumnGap="16px"
        mt="80px"
      >
        <Box
          mx="24px"
          pb="48px"
          // Give a little bit more room on top for the rotated/translated back card
          mt="calc(3.5vw + 150px)"
          flexShrink={0}
          position="relative"
        >
          {/* Back card wrapper */}
          <Box
            boxShadow="businessCard"
            borderRadius={2}
            css={css`
              canvas {
                border-radius: inherit;
              }
            `}
            position="absolute"
            top={0}
            left={0}
            zIndex={0}
            transform="translate(-100px, -150px) rotateZ(-8deg)"
          >
            <TemplateCard
              side="back"
              width="100%"
              templateId="velia"
              options={sampleCardOptions}
            />
          </Box>
          {/* Front card wrapper */}
          <Box
            boxShadow="businessCard"
            borderRadius={2}
            position="relative"
            zIndex={1}
            css={css`
              canvas {
                border-radius: inherit;
              }
            `}
          >
            <TemplateCard
              side="front"
              width="100%"
              templateId="velia"
              options={sampleCardOptions}
            />
          </Box>
        </Box>

        <Box px="24px" py="48px">
          <Text.H1 color={colors.nomusBlue} mb="24px" fontWeight="300">
            Customize with card templates
          </Text.H1>
          <Text.Body mb="24px">
            It’s easy to build your own beautiful, personalized card with our
            templates. Pick a template, put in your info, choose some colors –
            all you have to do now is give it a shot!
          </Text.Body>
          <Form.Label htmlFor="name">Your name</Form.Label>
          <Form.Input
            id="name"
            minWidth="400px"
            placeholder="John Appleseed"
            value={userEnteredName}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              setUserEnteredName(event.currentTarget.value)
            }}
          />
          <Link
            to={
              userEnteredName
                ? `/card-studio/template?prefillName=${userEnteredName}`
                : `/card-studio/template`
            }
          >
            <Button
              mt="24px"
              variant="golden"
              size="big"
              rightIcon={<Icon of="arrowRight" />}
            >
              Bring it into Card Studio
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Upload your own design */}
      <Box py="80px">
        <Box
          container
          display="grid"
          gridTemplateColumns="5fr 7fr"
          gridColumnGap="16px"
        >
          <Box p="24px">
            <Text.H1 color={colors.nomusBlue} mb="24px" fontWeight="300">
              Upload your own design
            </Text.H1>
            <Text.Body mb="24px">
              Keep your brand going strong while still tapping into the power of
              Nomus.
            </Text.Body>
            <Link to="/card-studio/custom">
              <Button
                variant="golden"
                size="big"
                rightIcon={<Icon of="arrowRight" />}
              >
                Customize your card
              </Button>
            </Link>
          </Box>
          <Box
            py="100px"
            bg={`url(${wavyLoopImage})`}
            backgroundSize="contain"
            backgroundPosition="right"
            backgroundRepeat="no-repeat"
          >
            <Image
              width="calc((6/7) * 100%)"
              borderRadius={4}
              boxShadow="businessCard"
              objectFit="cover"
              src={cardCustomBg}
            />
          </Box>
        </Box>
      </Box>

      <Image w="100%" src={dividerWave2} />

      {/* Maintain a richer contacts list */}
      <Box pt="80px" bg={ivoryGradientBg}>
        <Box
          container
          display="grid"
          gridTemplateColumns="5fr 7fr"
          gridColumnGap="16px"
        >
          <Box p="24px">
            <Text.H1 color={colors.nomusBlue} mb="24px" fontWeight="300">
              Maintain a richer contacts list
            </Text.H1>
            <Text.Body mb="24px">
              Collect contacts to your account for easy access to their digital
              profiles and add your own notes to make your connections personal.
            </Text.Body>

            <Text.Body mb="24px">
              Congrats! You’re on your way to creating and expanding an
              authentic network.
            </Text.Body>
            <Link to="/register">
              <Button
                variant="golden"
                size="big"
                rightIcon={<Icon of="arrowRight" />}
              >
                Create your profile
              </Button>
            </Link>
          </Box>
          {/* Negative margin to get the right edge of the image to disappear off the right edge of the screen */}
          <Box mr="-100px">
            <Image
              objectFit="cover"
              src={contactRollImage}
              borderRadius="8px"
              boxShadow="businessCard"
            />
          </Box>
        </Box>

        {/* Testimonials */}
        <Box pt="80px">
          <Text.H1
            color={colors.nomusBlue}
            mb="24px"
            fontWeight="300"
            textAlign="center"
          >
            Take it from our early adopters
          </Text.H1>
          <Box position="relative">
            <Box
              container
              bg={`url(${testimonialBg})`}
              backgroundPosition="center"
              backgroundSize="100% 50%"
              py="24px"
            >
              <Box
                position="relative"
                top={0}
                width="100%"
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gridColumnGap={2}
              >
                <TestimonialCard
                  authorName="Sunny Alessandro"
                  authorHeadline="Director of Cool Company"
                  quote="This needs to be a short quote from one of our Alpha customers. It’s gotta just be a couple of sentences. Actually, I’m thinking it can actually be longer than that. I’d say maybe eight lines max. How’s that, punk?"
                  authorImageSrc="http://placehold.it/300x300"
                />
                <TestimonialCard
                  authorName="Sunny Alessandro"
                  authorHeadline="Director of Cool Company"
                  quote="This needs to be a short quote from one of our Alpha customers. It’s gotta just be a couple of sentences. Actually, I’m thinking it can actually be longer than that. I’d say maybe eight lines max. How’s that, punk?"
                  authorImageSrc="http://placehold.it/300x300"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Meet the crew */}
      <Box container pt="80px">
        <Text.H1 color={colors.nomusBlue} mb="24px" fontWeight="300">
          Meet the crew
        </Text.H1>
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gridColumnGap="16px"
        >
          <CrewMemberCell
            name="Anshul Aggarwal"
            title="Chief Executive Officer"
            imageSrc={anshulImage}
          />
          <CrewMemberCell
            name="Hanad Musa"
            title="Chief Operations Officer"
            imageSrc={hanadImage}
          />
          <CrewMemberCell
            name="Cindy Cheung"
            title="Chief Design Officer"
            imageSrc={cindyImage}
          />
          <CrewMemberCell
            name="Bibek Ghimire"
            title="Chief Technology Officer"
            imageSrc={bibekImage}
          />
        </Box>
      </Box>

      <Image w="100%" src={dividerWave3} />

      {/* Let's get tappin' */}
      <Box
        container
        py="80px"
        bg={colors.ivory}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Text.H1 textAlign="center" fontWeight={300} my="24px">
          Let's get tappin'
        </Text.H1>
        <Image src={footerIllustration} mb="24px" />
        <Text.Body mb="24px" textAlign="center">
          What are you waiting for? It’s time to build your online presence and
          start meeting (and remembering) people with Nomus.
        </Text.Body>
        <Link to="/register">
          <Button
            variant="golden"
            size="big"
            rightIcon={<Icon of="arrowRight" />}
          >
            Get started
          </Button>
        </Link>
      </Box>

      <Footer colorScheme="light" />
    </Box>
  )
}

export default LandingPage
