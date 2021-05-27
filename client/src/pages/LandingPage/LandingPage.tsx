import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Footer from 'src/components/Footer'
import * as Form from 'src/components/Form'
import Icon from 'src/components/Icon'
import Image from 'src/components/Image'
import Link from 'src/components/Link'
import Navbar from 'src/components/Navbar'
import * as Text from 'src/components/Text'
import cardCustomBg from 'src/images/card-custom-promo-bg.png'
import contactRollImage from 'src/images/contact-roll.png'
import anshulImage from 'src/images/crew/anshul.png'
import bibekImage from 'src/images/crew/bibek.png'
import cindyImage from 'src/images/crew/cindy.png'
import hanadImage from 'src/images/crew/hanad.png'
import dividerWave1 from 'src/images/divider-wave-1.svg'
import dividerWave2 from 'src/images/divider-wave-2.svg'
import dividerWave3 from 'src/images/divider-wave-3.svg'
import footerIllustration from 'src/images/footer-illustration.svg'
import freeShippingImage from 'src/images/free-shipping.svg'
import heroBg from 'src/images/hero-bg.png'
import heroCurvyFilter from 'src/images/hero-curvy-filter.svg'
import humanServiceImage from 'src/images/human-service.svg'
import professionalCardsImage from 'src/images/professional-cards.png'
import qualityYouCanTrustImage from 'src/images/quality-you-can-trust.svg'
import seamlessExperienceImage from 'src/images/seamless-experience.svg'
import testimonialBg from 'src/images/testimonial-bg.svg'
import wavyLoopImage from 'src/images/wavy-loop.svg'
import yourDashboardDesktop from 'src/images/your-dashboard-desktop.png'
import yourDashboardMobile from 'src/images/your-dashboard-mobile.png'
import { colors } from 'src/styles'
import { useBreakpoint } from 'src/styles/breakpoints'
import { CardTemplateRenderOptions } from 'src/templates/base'
// Landing-page specific imports
import CrewMemberCell from './CrewMemberCell'
import MiniCardBuilder from './MiniCardBuilder'
import PromiseItem from './PromiseItem'
import TestimonialCarousel from './TestimonialCarousel'
import testimonials from './testimonials'

const ivoryGradientBg = `linear-gradient(180deg, ${colors.ivory} 70%, ${colors.white} 100%)`

const LandingPage = () => {
  const [userEnteredName, setUserEnteredName] = React.useState('')
  const isDesktop = useBreakpoint('lg')

  const sampleCardOptions: CardTemplateRenderOptions = React.useMemo(
    () => ({
      colorScheme: {
        background: colors.white,
        text: colors.nomusBlue,
      },
      contactInfo: {
        name: userEnteredName || 'Replace with your lovely name',
        headline: 'chief of everything',
      },
      omittedContactInfoFields: [],
      graphic: {
        url: '/logo.png',
        size: 0.5,
      },
      qrCodeUrl: 'https://nomus.me',
    }),
    [userEnteredName],
  )

  return (
    <Box overflowX="hidden" position="relative" zIndex={0}>
      <Navbar />

      {/* Hero */}
      <Box position="relative">
        <Box
          position="absolute"
          // Include an additional white gradient overlay in mobile because we won't have the curvy filter
          // that we do in desktop
          bg={{
            base: `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%), bottom/cover no-repeat url(${heroBg})`,
            lg: `bottom/cover no-repeat url(${heroBg})`,
          }}
          height={{ base: '50%', lg: '80vh' }}
          width="100%"
          backgroundSize="cover"
          backgroundPosition="bottom"
        >
          <Image
            display={{ base: 'none', lg: 'inline-block' }}
            src={heroCurvyFilter}
            width="100%"
            objectFit="cover"
            objectPosition="bottom right"
            height="calc(100% - 100px)"
            position="absolute"
            bottom="100px"
            right={{ lg: '15vw', md: '0vw' }}
          />
        </Box>
        <Box
          container
          position="relative"
          height={{ base: '50%', lg: '80vh' }}
          pt={{ base: '140px', lg: '72px' }}
        >
          <Box width={{ base: '100%', lg: '45%' }}>
            <Text.H1 color={colors.nomusBlue} mb="24px" fontWeight="300">
              Tap. Connect. Network with purpose.
            </Text.H1>
            <Text.Body>
              Get your own personalized contactless card complete with the Nomus
              digital product, built for accessing, managing, and expanding your
              network.
            </Text.Body>
            <Box
              mt="24px"
              display="flex"
              flexDirection={{ base: 'column', lg: 'row' }}
              alignItems={{ base: 'stretch', lg: 'center' }}
            >
              <Box mr="16px" width="100%">
                <Link to="/shop">
                  <Button
                    width="100%"
                    variant="golden"
                    size="big"
                    rightIcon={<Icon of="arrowRight" />}
                  >
                    Customize your card
                  </Button>
                </Link>
              </Box>

              <Link to="/register">
                <Button width="100%" variant="tertiary">
                  Sign up
                </Button>
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
          gridTemplateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }}
          gridTemplateRows={{ base: '1fr 1fr', lg: '1fr' }}
          gridGap="8px"
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
        gridTemplateColumns={{ base: '1fr', lg: '7fr 5fr' }}
        gridTemplateRows={{ base: 'repeat(3, auto)', lg: 'auto 1fr' }}
        gridTemplateAreas={{
          base: `
          "image"
          "title"
          "description"
        `,
          lg: `
          "image title"
          "image description"
        `,
        }}
        gridColumnGap="16px"
        gridRowGap={0}
        mt="80px"
        py={{ base: '40px', lg: '48px' }}
      >
        <Text.H1
          gridArea="title"
          color={colors.nomusBlue}
          mb={{ base: '16px', lg: '24px' }}
          fontWeight="300"
        >
          Professional, tappable cards
        </Text.H1>
        <Image
          gridArea="image"
          placeSelf="start"
          objectFit="cover"
          src={professionalCardsImage}
          mb={{ base: '24px', lg: 0 }}
        />
        <Box gridArea="description" placeSelf="start">
          <Text.Body mb="24px">
            Inside these business cards, there’s something that sets it apart
            from all the others – an NFC (near-field communication) chip. With
            the tap of your new business card to the back of a smartphone, share
            your personal contact page digitally.
          </Text.Body>
          <Box display="grid" placeContent={{ base: 'stretch', lg: 'start' }}>
            <Link to="/shop">
              <Button
                width="100%"
                variant="golden"
                size="big"
                rightIcon={<Icon of="arrowRight" />}
              >
                Get a card
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      <Image w="100%" src={dividerWave1} />

      {/* Your identity, wherever you go */}
      <Box pt={{ base: '64px', lg: '80px' }} bg={ivoryGradientBg}>
        <Box
          container
          display="grid"
          gridTemplateColumns={{ base: '1fr', lg: '5fr 7fr' }}
          gridTemplateRows={{ base: '', lg: 'auto auto 1fr' }}
          gridTemplateAreas={{
            base: `
            "title"
            "image"
            "description"
            "button"
          `,
            lg: `
            "title image"
            "description image"
            "button image"
          `,
          }}
          gridColumnGap="16px"
          gridRowGap="16px"
        >
          <Text.H1
            gridArea="title"
            color={colors.nomusBlue}
            mb="24px"
            fontWeight="300"
          >
            Your identity, wherever you go
          </Text.H1>

          <Text.Body gridArea="description">
            Connect once, and your contacts can revisit your digital identity
            whenever, wherever. Start leaving stronger, more memorable
            impressions.
          </Text.Body>

          <Box
            gridArea="button"
            display="grid"
            placeContent={{ base: 'stretch', lg: 'start' }}
          >
            <Link to="/register">
              <Button
                width="100%"
                variant="golden"
                size="big"
                rightIcon={<Icon of="arrowRight" />}
              >
                Create your profile
              </Button>
            </Link>
          </Box>

          {/* margin-right exists to account for the offset absolute[right=-13%] applied to the mobile image below */}
          <Box gridArea="image" position="relative" mr="13%">
            <Image
              src={yourDashboardDesktop}
              borderRadius="4px"
              boxShadow="card"
              width="100%"
              position="relative"
            />
            <Image
              src={yourDashboardMobile}
              borderRadius="8px"
              boxShadow="card"
              position="absolute"
              bottom={0}
              right="-13%"
              height="90%"
            />
          </Box>
        </Box>
      </Box>

      {/* Mini card builder */}
      <Box
        container
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '7fr 5fr' }}
        gridTemplateRows={{ base: '', lg: 'repeat(3, auto) 1fr' }}
        gridTemplateAreas={{
          base: `
          "title"
          "description"
          "cardPreview"
          "input"
          "button"
        `,
          lg: `
          "cardPreview title"
          "cardPreview description"
          "cardPreview input"
          "cardPreview button"
        `,
        }}
        gridColumnGap="52px"
        gridRowGap={{ base: '16px', lg: '24px' }}
        mt="80px"
      >
        <Box gridArea="cardPreview" flexShrink={0}>
          <MiniCardBuilder templateId="konawide" options={sampleCardOptions} />
        </Box>

        <Text.H1 gridArea="title" color={colors.nomusBlue} fontWeight="300">
          Customize with card templates
        </Text.H1>

        <Text.Body gridArea="description">
          It’s easy to build your own beautiful, personalized card with our
          templates. Pick a template, put in your info, choose some colors – all
          you have to do now is give it a shot!
        </Text.Body>

        <Box gridArea="input">
          <Form.Label htmlFor="name">Your name</Form.Label>
          <Form.Input
            width={{ base: '100%', lg: '400px' }}
            id="name"
            placeholder="John Appleseed"
            value={userEnteredName}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              setUserEnteredName(event.currentTarget.value)
            }}
          />
        </Box>
        <Box
          gridArea="button"
          display="grid"
          placeContent={{ base: 'stretch', lg: 'start' }}
        >
          <Link
            to={
              userEnteredName
                ? `/card-studio/template?prefillName=${userEnteredName}`
                : `/card-studio/template`
            }
          >
            <Button
              mt="24px"
              width="100%"
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
          gridTemplateColumns={{ base: '1fr', lg: '5fr 7fr' }}
          gridTemplateRows={{ base: 'repeat(3, auto)', lg: 'auto 1fr' }}
          gridTemplateAreas={{
            base: `
            "title"
            "image"
            "description"
          `,
            lg: `
            "title image"
            "description image"
          `,
          }}
          gridColumnGap="16px"
          gridRowGap="16px"
        >
          <Text.H1
            gridArea="title"
            color={colors.nomusBlue}
            mb="24px"
            fontWeight="300"
          >
            Upload your own design
          </Text.H1>
          <Box gridArea="description">
            <Text.Body mb="24px">
              Keep your brand going strong while still tapping into the power of
              Nomus.
            </Text.Body>
            <Box display="grid" placeContent={{ base: 'stretch', lg: 'start' }}>
              <Link to="/card-studio/custom">
                <Button
                  width="100%"
                  variant="golden"
                  size="big"
                  rightIcon={<Icon of="arrowRight" />}
                >
                  Customize your card
                </Button>
              </Link>
            </Box>
          </Box>
          <Box
            gridArea="image"
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
      <Box pt={{ base: '64px', lg: '80px' }} bg={ivoryGradientBg}>
        <Box
          container
          display="grid"
          gridTemplateColumns={{ base: '1fr', lg: '5fr 7fr' }}
          gridTemplateRows={{ base: '1fr', lg: 'repeat(2, auto) 1fr' }}
          gridTemplateAreas={{
            base: `
            "title"
            "image"
            "description"
            "button"
          `,
            lg: `
            "title image"
            "description image"
            "button image"
          `,
          }}
          gridColumnGap="16px"
          gridRowGap="16px"
        >
          <Text.H1
            gridArea="title"
            color={colors.nomusBlue}
            mb="24px"
            fontWeight="300"
          >
            Maintain a richer contacts list
          </Text.H1>

          <Box gridArea="description">
            <Text.Body mb="24px">
              Collect contacts to your account for easy access to their digital
              profiles and add your own notes to make your connections personal.
            </Text.Body>

            <Text.Body>
              Congrats! You’re on your way to creating and expanding an
              authentic network.
            </Text.Body>
          </Box>

          <Box
            gridArea="button"
            display="grid"
            placeContent={{ base: 'stretch', lg: 'start' }}
          >
            <Link to="/register">
              <Button
                width="100%"
                variant="golden"
                size="big"
                rightIcon={<Icon of="arrowRight" />}
              >
                Create your profile
              </Button>
            </Link>
          </Box>
          {/* Negative margin to get the right edge of the image to disappear off the right edge of the screen */}
          <Box gridArea="image" mr={{ base: undefined, lg: '-100px' }}>
            <Image
              objectFit="cover"
              src={contactRollImage}
              borderRadius="8px"
              boxShadow="businessCard"
            />
          </Box>
        </Box>
      </Box>

      {/* Testimonials */}
      <Box pt={{ base: '64px', lg: '80px' }}>
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
            bg={`url(${testimonialBg})`}
            backgroundPosition="center"
            backgroundSize="contain"
            backgroundRepeat="no-repeat"
            py="24px"
          >
            <Box container={isDesktop}>
              <TestimonialCarousel testimonials={testimonials} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Meet the crew */}
      <Box
        container
        pt={{ base: '64px', lg: '80px' }}
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '9fr 3fr' }}
        gridRowGap={{ base: '16px', lg: '24px' }}
        gridTemplateAreas={{
          base: `
          "title"
          "description"
          "crew"
          "button"
        `,
          lg: `
          "title title"
          "description button"
          "crew crew"
        `,
        }}
      >
        <Text.H1 gridArea="title" color={colors.nomusBlue} fontWeight="300">
          Meet the crew
        </Text.H1>
        <Text.Body gridArea="description">
          Four young dreamers (so far!) who want to ease the lives of working
          professionals and better connect the world.
        </Text.Body>
        <Box
          gridArea="button"
          display="grid"
          placeContent={{ base: 'stretch', lg: 'start' }}
        >
          <Link to="/about">
            <Button
              width="100%"
              variant="golden"
              size="big"
              rightIcon={<Icon of="arrowRight" />}
            >
              About Nom(us)
            </Button>
          </Link>
        </Box>
        <Box
          gridArea="crew"
          display="grid"
          gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gridTemplateRows={{ base: 'repeat(2, 1fr)', lg: '1fr' }}
          p="16px"
          gridGap="32px"
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

        <Box
          display="grid"
          placeContent={{ base: 'stretch', lg: 'center' }}
          width="100%"
        >
          <Link to="/register">
            <Button
              width="100%"
              variant="golden"
              size="big"
              rightIcon={<Icon of="arrowRight" />}
            >
              Get started
            </Button>
          </Link>
        </Box>
      </Box>

      <Footer colorScheme="light" />
    </Box>
  )
}

export default LandingPage
