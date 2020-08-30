import { css } from '@emotion/core'
import * as React from 'react'
import Box from 'src/components/Box'
import Container from 'src/components/Container'
import Card from 'src/components/Card'
import Button from 'src/components/Button'
import Navbar from 'src/components/Navbar'
import Footer from 'src/components/Footer'
import Link from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import cardTemplateBg from 'src/images/card-template-promo-bg.png'
import cardCustomBg from 'src/images/card-custom-promo-bg.png'
import { QUANTITY_TO_PRICE } from 'src/utils/pricing'
import { formatDollarAmount } from 'src/utils/money'
import { colors } from 'src/styles'
import Image from 'src/components/Image'

interface Props {}

const bp = 'lg'

const ShopFront = ({}: Props) => {
  return (
    <Box position="relative">
      <Navbar />
      <Box
        position="absolute"
        top="100px"
        left="0"
        width="100%"
        height="250px"
        bg="offWhite"
      />
      <Container>
        <Box position="relative" zIndex={1} px={{ _: 0, [bp]: 5 }} pb={5}>
          <Box
            position="relative"
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Text.PageHeader textAlign="center" mt={3} mb={1}>
              Design your Nomus card
            </Text.PageHeader>
            <Text.Body2
              textAlign="center"
              mb={2}
              css={css({ maxWidth: '80%' })}
            >
              Make your card all your own with one of our templates or your own
              design. Whichever you choose, your cards will have the Nomus
              tap-to-share chip built in.
            </Text.Body2>

            <Box
              my={3}
              width="100%"
              display="grid"
              gridColumnGap={3}
              gridRowGap={2}
              gridTemplateColumns={{ _: '1fr', [bp]: '1fr 1fr' }}
              gridTemplateRows={{ _: 'auto', [bp]: '1fr auto' }}
              gridTemplateAreas={{
                _: `
                  "firstTitle"
                  "firstCard"
                  "firstNote"
                  "secondTitle"
                  "secondCard"
                  "secondNote"
                `,
                [bp]: `
                  "firstTitle secondTitle"
                  "firstCard secondCard"
                  "firstNote secondNote"
                `,
              }}
            >
              <Text.SectionSubheader textAlign="center" gridArea="firstTitle">
                A Nomus template
              </Text.SectionSubheader>
              <Box
                gridArea="firstCard"
                position="relative"
                borderRadius={2}
                boxShadow="workingWindow"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                overflow="hidden"
              >
                <Image src={cardTemplateBg} />
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
                  <Button
                    width="calc(100% * (4/6))"
                    variant="primary"
                    size="big"
                    disabled
                  >
                    Coming soon
                  </Button>
                </Box>
              </Box>

              <Text.Body2 textAlign="center" gridArea="firstNote">
                Choose from our templates, add some details, and be done in no
                time.
              </Text.Body2>

              <Text.SectionSubheader textAlign="center" gridArea="secondTitle">
                Your own design
              </Text.SectionSubheader>
              <Box
                mt={{ _: 3, [bp]: 'unset' }}
                gridArea="secondCard"
                position="relative"
                borderRadius={2}
                boxShadow="workingWindow"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                overflow="hidden"
              >
                <Image
                  src={cardCustomBg}
                  w="100%"
                  h="100%"
                  css={css`
                    object-fit: cover;
                  `}
                />
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
                    asButton
                    buttonStyle="primary"
                    buttonSize="big"
                    to="/card-studio/custom"
                  >
                    Upload your design
                  </Link>
                </Box>
              </Box>

              <Text.Body2 textAlign="center" gridArea="secondNote">
                Design and upload your own card and we'll take care of the rest.
              </Text.Body2>
            </Box>

            <Text.SectionHeader mt={4} mb={2}>
              Pricing tiers
            </Text.SectionHeader>
            <Box
              display="grid"
              gridTemplateColumns={{ _: undefined, [bp]: 'repeat(3, 4fr)' }}
              gridTemplateRows={{ _: 'repeat(3, 4fr)', [bp]: 'unset' }}
              gridColumnGap={3}
              gridRowGap={3}
            >
              {([
                {
                  quantity: 25,
                  icon: <SVG.Smile1 />,
                  description:
                    'Just enough to get you started in the NFC business cards game.',
                  topBarColor: colors.cyanProcess,
                },
                {
                  quantity: 50,
                  icon: <SVG.Smile2 />,
                  description:
                    'You’ll be perfectly stocked for your next event or conference.',
                  topBarColor: colors.gold,
                },
                {
                  quantity: 100,
                  icon: <SVG.Smile3 />,
                  description:
                    'Somebody’s popular! Or planning ahead. Or both.',
                  topBarColor: colors.brightCoral,
                },
              ] as const).map(
                ({ quantity, description, icon, topBarColor }) => {
                  const price = QUANTITY_TO_PRICE[quantity]
                  return (
                    <Card
                      key={quantity}
                      topBarColor={topBarColor}
                      align="mix"
                      size="small"
                      icon={icon}
                      header={`${quantity} cards / ${formatDollarAmount(
                        price,
                      )}`}
                      subheader={`${formatDollarAmount(
                        Math.round(price / quantity),
                      )} per card`}
                      bodyText={description}
                      boxShadow="workingWindow"
                    />
                  )
                },
              )}
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}

export default ShopFront
