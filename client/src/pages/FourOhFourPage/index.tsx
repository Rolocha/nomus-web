import { css } from '@emotion/react'
import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import Link from 'src/components/Link'
import Navbar from 'src/components/Navbar'
import fourOhFourCardBack from './404-card-back.svg'
import fourOhFourCardFront from './404-card-front.svg'

const FourOhFourPage = () => {
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box
        container
        display="grid"
        gridTemplateColumns={{ _: '1fr', lg: '9fr 3fr' }}
        gridTemplateRows={{ _: '1fr 4fr 4fr 3fr', lg: '1fr' }}
        gridTemplateAreas={{
          _: `"." "cards" "buttons" "."`,
          lg: `"cards buttons"`,
        }}
        placeContent="center"
        flexGrow={1}
      >
        <Box
          position="relative"
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gridArea="cards"
        >
          <Image
            src={fourOhFourCardBack}
            w="70%"
            boxShadow="businessCard"
            css={css({
              transform: 'scale(0.866) translate(-25%) rotateZ(-30deg)',
            })}
          />
          <Image
            src={fourOhFourCardFront}
            w="70%"
            boxShadow="businessCard"
            position="absolute"
            css={css({
              transform: 'scale(0.866) translate(25%, 4%) rotateZ(-10deg)',
            })}
          />
        </Box>
        <Box
          display="grid"
          gridArea="buttons"
          gridTemplateColumns="1fr"
          gridRowGap={3}
          placeContent={{ _: 'center', lg: 'center stretch' }}
        >
          <Link asButton buttonStyle="primary" buttonSize="big" to="/">
            Return to homepage
          </Link>
          <Link
            asButton
            buttonStyle="secondary"
            buttonSize="big"
            to="mailto:hello@nomus.me"
          >
            Contact support
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default FourOhFourPage
