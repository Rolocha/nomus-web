import * as React from 'react'
import { css } from '@emotion/core'

import { Heading, Body, Caption } from 'src/components/Text'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as SVG from 'src/components/SVG'
import Button from 'src/components/Button'
import { colors } from 'src/styles'

import heroImage from 'src/images/hero-image.png'

// There are two layouts for the Hero, split across the lg breakpoint
// _: < .lg breakpoint - image over text
// lg: >= .lg breakpoint - image to right of text

const SM_IMAGE_WIDTH = '60%'

const Hero = () => (
  <Box>
    <Box mt="30px" pb="50px" width="100%" position="relative" bg="primaryTeal">
      <Box
        position={{ _: 'relative', lg: 'absolute' }}
        top={{ _: '-30px', lg: '-30px' }}
        left={{ _: '20px', lg: `calc(100% - ${SM_IMAGE_WIDTH})` }}
        width={{ _: '100%', lg: SM_IMAGE_WIDTH }}
        height={{ _: '230px', lg: '100%' }}
      >
        <Image
          src={heroImage}
          alt=""
          width="100%"
          height="100%"
          borderBottomLeftRadius="42px"
          css={css`
            object-fit: cover;
          `}
        />
        <SVG.LargeSquiggle
          css={css`
            height: 100%;
            position: absolute;
            left: -146px;
            bottom: 12px;
          `}
        />
      </Box>
      <Box
        pt={{ _: '10px', lg: '90px' }}
        pl={{ _: '30px', lg: '100px' }}
        pr={{ _: '30px', lg: '50px' }}
        width={{ _: '100%', lg: `calc(100% - ${SM_IMAGE_WIDTH})` }}
      >
        <Heading mt="0" color="bgBeige">
          Tap. Connect. Network with purpose.
        </Heading>
        <Body color="bgBeige">
          Your personalized NFC card with the Rolocha app, built for accessing,
          managing, and expanding your network.
        </Body>
        <Box
          mb="30px"
          css={css`
            & > ${Button}:first-of-type {
              margin-right: 10px;
              margin-bottom: 10px;
            }
          `}
        >
          <Button variant="primary">Customize NFC card</Button>
          <Button variant="light">Sign up</Button>
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
      css={css`
        background: linear-gradient(
          0deg,
          transparent 50%,
          50%,
          ${colors.primaryTeal}
        );
      `}
    >
      <Box
        bg="primaryGold"
        px="20px"
        maxWidth="85vw"
        borderTopLeftRadius="50px"
        borderBottomRightRadius="50px"
        position="relative"
        css={css`
          text-align: center;
        `}
      >
        <Box
          display="flex"
          flexWrap={{ _: 'wrap', md: 'nowrap' }}
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
              flexBasis={{ _: '50%', lg: '100%' }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              maxHeight="290px"
              px={{ _: '10px', lg: '20px' }}
            >
              <ImageComponent />
              <Caption>{text}</Caption>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
)

export default Hero
