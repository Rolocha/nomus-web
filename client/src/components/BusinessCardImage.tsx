import { LayoutProps } from '@chakra-ui/styled-system'
import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import businessCardFallback from 'src/images/business-card-fallback.svg'
import { colors } from 'src/styles'
import Icon from './Icon'

interface CommonProps {
  nameForImageAlt?: string
  // Both width and height are optional but you should probably provide at least one or the image won't show up
  height?: LayoutProps['height']
  width?: LayoutProps['width']
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
    bg="white"
    borderRadius="50%"
    p={1}
    role="button"
    onClick={onClick}
    boxShadow="knob"
    zIndex={3}
    transform="translate(40%, -40%)"
    cursor="pointer"
  >
    <Icon of="sync" color={colors.nomusBlue} />
  </Box>
)

const faceStyles = {
  transition: 'opacity 0.3s ease, transform 0.3s ease',
  backfaceVisibility: 'hidden',
}

const visibleStyles = {
  opacity: 1,
  transform: 'rotateY(0deg)',
}

const hiddenStyles = {
  opacity: 0,
  transform: 'rotateY(-180deg)',
}

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
        sx={{ ...faceStyles, ...(showBack ? hiddenStyles : visibleStyles) }}
      >
        {frontImage}
      </Box>
      <Box
        width={props.width}
        position="absolute"
        top={0}
        left={0}
        sx={{
          ...faceStyles,
          ...(showBack ? visibleStyles : hiddenStyles),
        }}
      >
        {backImage}
      </Box>
      <FlipButton onClick={() => setShowBack(!showBack)} />
    </Box>
  )
}

export default BusinessCardImage
