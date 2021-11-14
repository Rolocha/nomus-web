import * as React from 'react'
import Box from 'src/components/Box'
import Footer from 'src/components/Footer'
import Image from 'src/components/Image'
import Link from 'src/components/Link'
import Navbar from 'src/components/Navbar'
import PricingTiers from 'src/components/PricingTiers'
import SampleTemplateCard from 'src/components/SampleTemplateCard'
import * as Text from 'src/components/Text'
import cardCustomBg from 'src/images/card-custom-promo-bg.png'
import cardTemplateBg from 'src/images/card-template-promo-bg.png'
import curvyPointerLeftImage from 'src/images/curvy-pointer-left.svg'
import curvyPointerRightImage from 'src/images/curvy-pointer-right.svg'
import scatteredCardsImage from 'src/images/scattered-cards.svg'
import templateLibrary, { templateNames } from 'src/templates'

const bp = 'lg'

const ShopFront = () => {
  return (
    <Box position="relative" zIndex={0}>
      <Navbar />
      <Box
        zIndex={0}
        position="absolute"
        top="100px"
        left="0"
        width="100%"
        height="250px"
        bg="offWhite"
      />
      <Box container>
        <Box position="relative" zIndex={1} px={{ base: 0, [bp]: 5 }} pb={5}>
          <Box
            position="relative"
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Text.PageHeader textAlign="center" mt={3} mb={1}>
              Shop Nomus cards
            </Text.PageHeader>
            <Text.Body textAlign="center" mb={2} maxWidth="80%">
              Whichever you choose, your cards will have a Nomus tap-to-share
              chip built in.
            </Text.Body>

            <Box
              my={3}
              width="100%"
              display="grid"
              gridColumnGap={3}
              gridRowGap={2}
              gridTemplateColumns={{ base: '1fr', [bp]: '1fr 1fr' }}
              gridTemplateRows={{ base: 'auto', [bp]: '1fr auto' }}
              gridTemplateAreas={{
                base: `
                  "firstCard"
                  "firstNote"
                  "secondCard"
                  "secondNote"
                `,
                [bp]: `
                  "firstCard secondCard"
                  "firstNote secondNote"
                `,
              }}
            >
              <Box
                bg="white"
                gridArea="firstCard"
                position="relative"
                borderRadius="lg"
                boxShadow="workingWindow"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                overflow="hidden"
              >
                <Image w="100%" h="100%" src={cardTemplateBg} />
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Link
                    minWidth="calc(100% * (4/6))"
                    buttonStyle="primary"
                    buttonSize="big"
                    to="/card-studio/template"
                  >
                    Kickstart with a Nomus template
                  </Link>
                </Box>
              </Box>

              <Text.Body2 textAlign="center" gridArea="firstNote">
                Choose from our templates, add some details, and be done in no
                time.
              </Text.Body2>

              <Box
                mt={{ base: 3, [bp]: 'unset' }}
                gridArea="secondCard"
                position="relative"
                borderRadius="lg"
                boxShadow="workingWindow"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                overflow="hidden"
              >
                <Image src={cardCustomBg} w="100%" h="100%" objectFit="cover" />
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Link
                    minWidth="calc(100% * (4/6))"
                    buttonStyle="primary"
                    buttonSize="big"
                    to="/card-studio/custom"
                  >
                    Create a custom card
                  </Link>
                </Box>
              </Box>

              <Text.Body2 textAlign="center" gridArea="secondNote">
                Design your own card and upload it to get it printed with an NFC
                chip inside.
              </Text.Body2>
            </Box>

            <Text.H3 mt="64px">Shop templates</Text.H3>
            <Box
              display="grid"
              gridTemplateColumns={{
                base: 'repeat(2, 1fr)',
                [bp]: 'repeat(4, 1fr)',
              }}
              width="100%"
              gridGap="16px"
            >
              {templateNames.map((templateId) => {
                const template = templateLibrary[templateId]

                return (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Box width="100%" mb="8px" px="14px" py="25px">
                      <SampleTemplateCard templateId={templateId} />
                    </Box>
                    <Text.Body>{template.name}</Text.Body>
                    <Text.Body3>from $40.00</Text.Body3>
                  </Box>
                )
              })}
            </Box>

            <Text.H3 mt="32px">Preserve your brand</Text.H3>
            <Box my="16px" display="flex" alignItems="center">
              <Image
                display={{ base: 'none', [bp]: 'block' }}
                src={curvyPointerLeftImage}
                mr="13px"
              />
              <Image src={scatteredCardsImage} />
              <Image
                display={{ base: 'none', [bp]: 'block' }}
                src={curvyPointerRightImage}
                ml="13px"
              />
            </Box>
            <Text.Body>Custom card</Text.Body>
            <Text.Body3>from $40.00</Text.Body3>

            <Text.SectionHeader mt="50px" mb="16px">
              Pricing
            </Text.SectionHeader>

            <PricingTiers />
          </Box>
        </Box>
      </Box>
      <Footer colorScheme="light" />
    </Box>
  )
}

export default ShopFront
