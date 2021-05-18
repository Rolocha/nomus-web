import * as React from 'react'

import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import * as Form from 'src/components/Form'
import Navbar from 'src/components/Navbar'
import { colors } from 'src/styles'
import Button from 'src/components/Button'
import Icon from 'src/components/Icon'

import heroBg from './hero-bg.png'
import heroCurvyFilter from './hero-curvy-filter.svg'
import seamlessExperienceImage from './seamless-experience.svg'
import humanServiceImage from './human-service.svg'
import qualityYouCanTrustImage from './quality-you-can-trust.svg'
import freeShippingImage from './free-shipping.svg'
import professionalCardsImage from './professional-cards.png'
import contactInfoPageImage from './contact-info-page.png'
import TemplateCard from 'src/components/TemplateCard'
import { css } from '@emotion/react'

interface PromiseItemProps {
  title: string
  description: string
  imageSrc: string
}

const PromiseItem = ({ title, description, imageSrc }: PromiseItemProps) => (
  <Box>
    <Image src={imageSrc} />
    <Text.Body fontWeight="bold">{title}</Text.Body>
    <Text.Body>{description}</Text.Body>
  </Box>
)

const LandingPage = () => {
  const [userEnteredName, setUserEnteredName] = React.useState('')

  return (
    <Box overflowX="hidden" position="relative" zIndex={0}>
      <Navbar />

      {/* Hero */}
      <Box
        position="relative"
        bg={`url(${heroBg})`}
        height="min(85vh, 800px)"
        backgroundSize="cover"
        backgroundPosition="center"
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
            <Box mt="24px" display="flex">
              <Box mr="16px">
                <Button
                  variant="primary"
                  size="big"
                  rightIcon={<Icon of="arrowRightO" />}
                >
                  Customize your card
                </Button>
              </Box>
              <Button variant="tertiary">Sign up</Button>
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
      <Box container display="flex" mt="80px">
        <Image width="50%" objectFit="cover" src={professionalCardsImage} />
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
          <Button
            variant="primary"
            size="big"
            rightIcon={<Icon of="arrowRightO" />}
          >
            Get a card
          </Button>
        </Box>
      </Box>

      {/* Your identity, wherever you go */}
      <Box pt="80px" bg={colors.offWhite}>
        <Box container display="flex">
          <Box p="24px">
            <Text.H1 color={colors.nomusBlue} mb="24px" fontWeight="300">
              Your identity, wherever you go.
            </Text.H1>
            <Text.Body mb="24px">
              Connect once, and your contacts can revisit your digital identity
              whenever, wherever. Start leaving stronger, more memorable
              impressions.
            </Text.Body>
            <Button
              variant="primary"
              size="big"
              rightIcon={<Icon of="arrowRightO" />}
            >
              Create your profile
            </Button>
          </Box>
          <Image width="50%" objectFit="cover" src={contactInfoPageImage} />
        </Box>
      </Box>

      {/* Mini card builder */}
      <Box container display="flex" mt="80px">
        <Box px="24px" py="48px" width="50%" flexShrink={0}>
          <Box
            boxShadow="businessCard"
            borderRadius={2}
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
              options={{
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
              }}
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
            value={userEnteredName}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              setUserEnteredName(event.currentTarget.value)
            }}
          />
          <Button
            mt="24px"
            variant="primary"
            size="big"
            rightIcon={<Icon of="arrowRightO" />}
          >
            Bring it into Card Studio
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default LandingPage
