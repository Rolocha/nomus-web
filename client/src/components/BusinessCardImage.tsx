import { css } from '@emotion/core'
import * as CSS from 'csstype'
import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as SVG from 'src/components/SVG'
import {
  RequiredTheme,
  ResponsiveValue,
  TLengthStyledSystem,
} from 'styled-system'

interface Props {
  nameForImageAlt?: string
  frontImageUrl?: string
  backImageUrl?: string
  // Both width and height are optional but you should probably provide at least one or the image won't show up
  height?: ResponsiveValue<
    CSS.HeightProperty<TLengthStyledSystem>,
    RequiredTheme
  >
  width?: ResponsiveValue<CSS.WidthProperty<TLengthStyledSystem>, RequiredTheme>
}

const FlipButton = ({ onClick }: { onClick: () => void }) => (
  <Box
    position="absolute"
    top="0"
    right="0"
    width="30px"
    height="30px"
    bg="white"
    borderRadius="50%"
    p={1}
    role="button"
    onClick={onClick}
    boxShadow="knob"
    zIndex={3}
    css={css`
      transform: translate(40%, -40%);
      cursor: pointer;
      svg {
        width: 100%;
        height: 100%;
      }
    `}
  >
    <SVG.Sync />
  </Box>
)

const faceStyles = css({
  transition: 'opacity 0.3s ease, transform 0.3s ease',
  backfaceVisibility: 'hidden',
})

const visibleStyles = css({
  opacity: 1,
  transform: 'rotateY(0deg)',
})

const hiddenStyles = css({
  opacity: 0,
  transform: 'rotateY(-180deg)',
})

const createAltText = (side: string | null, name: string | null | undefined) =>
  `${side} of ${name ?? 'user'}'s Nomus card`

const BusinessCardImage = ({
  nameForImageAlt,
  frontImageUrl,
  backImageUrl,
  width,
  height,
}: Props) => {
  const [showBack, setShowBack] = React.useState(false)

  const frontImage = (
    <Image
      boxShadow="businessCard"
      w={width}
      h={height}
      src={frontImageUrl}
      alt={createAltText('front', nameForImageAlt)}
    />
  )
  const backImage = (
    <Image
      boxShadow="businessCard"
      w={width}
      h={height}
      src={backImageUrl}
      alt={createAltText('back', nameForImageAlt)}
    />
  )

  if (backImageUrl == null && frontImageUrl == null) {
    return frontImage
  }
  if (frontImageUrl == null) {
    return backImage
  }

  if (backImageUrl == null) {
    return frontImage
  }

  return (
    <Box position="relative" display="inline-block" width={width}>
      <Box
        width={width}
        css={css(faceStyles, showBack ? hiddenStyles : visibleStyles)}
      >
        {frontImage}
      </Box>
      <Box
        width={width}
        css={css(faceStyles, showBack ? visibleStyles : hiddenStyles, {
          position: 'absolute',
          top: 0,
          left: 0,
        })}
      >
        {backImage}
      </Box>
      <FlipButton onClick={() => setShowBack(!showBack)} />
    </Box>
  )
}

export default BusinessCardImage
