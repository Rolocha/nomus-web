import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Image from 'src/components/Image'
import * as SVG from 'src/components/SVG'
import { Body, BrandHeader } from 'src/components/Text'
import heroImage from 'src/images/hero-image.png'
import { colors } from 'src/styles'

// There are two layouts for the Hero, split across the lg breakpoint
// base: < .lg breakpoint - image over text
// lg: >= .lg breakpoint - image to right of text

const SM_IMAGE_WIDTH = '60%'

const Hero = () => (
  <Box>
    <Box mt="30px" pb="50px" width="100%" position="relative" bg="nomusBlue">
      <Box
        position={{ base: 'relative', lg: 'absolute' }}
        top={{ base: '-30px', lg: '-30px' }}
        left={{ base: '20px', lg: `calc(100% - ${SM_IMAGE_WIDTH})` }}
        width={{ base: '100%', lg: SM_IMAGE_WIDTH }}
        height={{ base: '230px', lg: '100%' }}
      >
        <Image
          src={heroImage}
          alt=""
          width="100%"
          height="100%"
          borderBottomLeftRadius="42px"
          objectFit="cover"
        />
        <SVG.LargeSquiggle />
      </Box>
      <Box
        pt={{ base: '10px', lg: '90px' }}
        pl={{ base: '30px', lg: '100px' }}
        pr={{ base: '30px', lg: '50px' }}
        width={{ base: '100%', lg: `calc(100% - ${SM_IMAGE_WIDTH})` }}
      >
        <BrandHeader mt="0" color="ivory">
          Tap. Connect. Network with purpose.
        </BrandHeader>
        <Body color="ivory">
          Your personalized NFC card with the Nomus app, built for accessing,
          managing, and expanding your network.
        </Body>
        <Box
          mb="30px"
          sx={{
            '& > button:first-of-type': {
              marginRight: '10px',
              marginBottom: '10px',
            },
          }}
        >
          <Button variant="primary">Customize NFC card</Button>
          <Button variant="tertiary">Sign up</Button>
        </Box>
        <SVG.Squiggle />
      </Box>
    </Box>

    {/* yellow informational box */}
    <Box
      position="relative"
      pt="30px"
      display="flex"
      justifyContent="center"
      background={`linear-gradient(
        0deg,
        transparent 50%,
        50%,
        ${colors.nomusBlue}
      )`}
    >
      <Box
        bg="gold"
        px="20px"
        maxWidth="85vw"
        borderTopLeftRadius="50px"
        borderBottomRightRadius="50px"
        position="relative"
        textAlign="center"
      >
        <Box
          display="flex"
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
          justifyContent="space-between"
          alignItems="stretch"
          position="relative"
          top="-25px"
          mb="-25px"
        >
          {[
            {
              ImageComponent: SVG.CreateNFCCardIllustration,
              text: 'create a custom nfc card',
            },
            {
              ImageComponent: SVG.TapCardIllustration,
              text: 'share your card with others',
            },
            {
              ImageComponent: SVG.SaveContactIllustration,
              text: 'save contacts to your phone',
            },
            {
              ImageComponent: SVG.NetworkIllustration,
              text: 'grow an authentic network',
            },
          ].map(({ ImageComponent, text }) => (
            <Box
              key={text}
              flexBasis={{ base: '50%', lg: '100%' }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              maxHeight="290px"
              px={{ base: '10px', lg: '20px' }}
            >
              <ImageComponent />
              <Body>{text}</Body>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
)

export default Hero
