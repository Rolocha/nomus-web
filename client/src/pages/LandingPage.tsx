import * as React from 'react'
import { css } from '@emotion/core'

import Box from 'src/components/Box'
import Image from 'src/components/Image'
import Button from 'src/components/Button'
import Navbar from 'src/components/Navbar'
import Hero from 'src/components/Hero'
import SplitRowContent, { bp } from 'src/components/SplitRowContent'
import { Heading, Body } from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import profilePagePreview1 from 'src/images/profile-page-preview-1.png'
import profilePagePreview2 from 'src/images/profile-page-preview-2.png'
import { mq } from 'src/styles/breakpoints'

const LandingPage = () => {
  return (
    <Box overflowX="hidden">
      <Navbar />
      <Hero />

      <SplitRowContent
        alternate
        wrapperProps={{
          px: { _: '30px', [bp]: '0' },
        }}
        rowProps={{
          mt: { _: '40px', [bp]: '120px' },
        }}
        titleProps={{
          px: { _: '0', [bp]: '50px' },
        }}
        contentProps={{
          px: { _: '0', [bp]: '50px' },
        }}
      >
        {[
          {
            key: 'get started',
            title: <Heading color="terraCotta">Get started</Heading>,
            image: (
              <Box
                data-aos="slide-right"
                data-os-easing="ease-in-out"
                data-aos-once="true"
              >
                <Box
                  mb={{ _: 'calc(8vw)', [bp]: '0' }}
                  pr={{ [bp]: '20px' }}
                  display="grid"
                  gridTemplateAreas={`
                  "card1 card1 card2 card2 ."
                  ". card3 card3 card4 card4"
                `}
                  gridTemplateColumns="30px 1fr 30px 1fr 30px"
                  css={css`
                    transform: rotate(-10deg);
                  `}
                >
                  {[
                    SVG.BusinessCardBack,
                    SVG.BusinessCardFront,
                    SVG.BusinessCardFront,
                    SVG.BusinessCardBack,
                  ].map((Comp, index) => (
                    <Box
                      key={index}
                      gridArea={`card${index + 1}`}
                      css={css`
                        justify-self: ${index === 0 || index === 2
                          ? 'flex-end'
                          : 'flex-start'};
                        ${mq[bp]} {
                          justify-self: stretch;
                        }
                        align-self: ${index < 2 ? 'flex-end' : 'flex-start'};
                      `}
                      minWidth={{ _: '300px', [bp]: '0' }}
                      m="10px"
                    >
                      <Comp
                        css={css`
                          box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
                        `}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ),
            content: (
              <Box>
                <Body>
                  Inside these business cards, there’s something that sets it
                  apart from all the others – an NFC (near-field communication)
                  chip. With a tap of your new business card to the back of a
                  smartphone, share your personal contact page digitally!
                </Body>
                <Body>
                  Upload your own design or choose one of the variety of
                  templates to really make your NFC business card your own.
                </Body>
                <Button variant="primary">Customize your own NFC card</Button>
              </Box>
            ),
          },
          {
            key: 'manage',
            title: (
              <Heading color="terraCotta">Manage and grow your network</Heading>
            ),
            image: (
              <Box
                css={css`
                  place-self: center;
                `}
                position="relative"
                display="flex"
                zIndex={0}
                data-aos="slide-left"
                data-aos-delay="300"
                data-os-easing="ease-in-out"
                data-aos-once="true"
              >
                <Image
                  src={profilePagePreview1}
                  alt="preview of top of contact page"
                  position="relative"
                  zIndex={1}
                  maxHeight={{ _: '400px', [bp]: '600px' }}
                />
                <Image
                  src={profilePagePreview2}
                  alt="preview of bottom of contact page"
                  zIndex={0}
                  position="relative"
                  maxHeight={{ _: '400px', [bp]: '600px' }}
                  css={css`
                    transform: translateX(-13%);
                  `}
                />
              </Box>
            ),
            content: (
              <Box>
                <Body>
                  View others’ digital contact pages and save them to your
                  account for easy access in the future. Collect contact cards
                  and add your own notes to make your connections personal.
                </Body>
                <Body>
                  Congrats! You’re on your way to creating and expanding an
                  authentic network. Hooray!
                </Body>
                <Button variant="primary">Sign up for Rolocha</Button>
              </Box>
            ),
          },
        ]}
      </SplitRowContent>
    </Box>
  )
}

export default LandingPage
