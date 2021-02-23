import { css } from '@emotion/react'
import * as CSS from 'csstype'
import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as SVG from 'src/components/SVG'
import businessCardFallback from 'src/images/business-card-fallback.svg'
import {
  RequiredTheme,
  ResponsiveValue,
  TLengthStyledSystem,
} from 'styled-system'

interface CommonProps {
  nameForImageAlt?: string
  // Both width and height are optional but you should probably provide at least one or the image won't show up
  height?: ResponsiveValue<
    CSS.Property.Height<TLengthStyledSystem>,
    RequiredTheme
  >
  width?: ResponsiveValue<
    CSS.Property.Width<TLengthStyledSystem>,
    RequiredTheme
  >
}

type ImagesPresentProps = {
  frontImageUrl?: string | null
  backImageUrl?: string | null
}
interface PlaceholderProps {
  placeholder: boolean
}

type Props = CommonProps & (ImagesPresentProps | PlaceholderProps)

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

const BusinessCardImage = (props: Props) => {
  const [showBack, setShowBack] = React.useState(false)

  if ('placeholder' in props && props.placeholder) {
    return (
      <Image
        src={businessCardFallback}
        alt="placeholder business card"
        boxShadow="businessCard"
        w={props.width}
        h={props.height}
      />
    )
  }

  const frontImage =
    'frontImageUrl' in props && props.frontImageUrl ? (
      <Image
        boxShadow="businessCard"
        w={props.width}
        h={props.height}
        src={props.frontImageUrl}
        alt={createAltText('front', props.nameForImageAlt)}
      />
    ) : null
  const backImage =
    'backImageUrl' in props && props.backImageUrl ? (
      <Image
        boxShadow="businessCard"
        w={props.width}
        h={props.height}
        src={props.backImageUrl}
        alt={createAltText('back', props.nameForImageAlt)}
      />
    ) : null

  if (frontImage == null && backImage == null) {
    console.error(
      'BusinessCardImage used without providing images or placeholder flag',
    )
    return null
  }

  if (!('frontImageUrl' in props) || props.frontImageUrl == null) {
    return backImage
  }

  if (!('backImageUrl' in props) || props.backImageUrl == null) {
    return frontImage
  }

  return (
    <Box position="relative" display="inline-block" width={props.width}>
      <Box
        width={props.width}
        css={css(faceStyles, showBack ? hiddenStyles : visibleStyles)}
      >
        {frontImage}
      </Box>
      <Box
        width={props.width}
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
