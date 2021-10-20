import * as React from 'react'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { useImageOrientation } from 'src/utils/image'
import { formatName, getInitials, IName } from 'src/utils/name'
import Box from './Box'
import Image from './Image'

interface Props {
  name: IName
  profilePicUrl?: string | null
  cardImage?: string | null
}

const ProfilePicture = ({ name, profilePicUrl, cardImage }: Props) => {
  const boxRef = React.useRef<HTMLDivElement>(null)
  const [boxWidth, setBoxWidth] = React.useState(0)

  const businessCardOrientation = useImageOrientation(cardImage ?? null)

  React.useEffect(() => {
    if (boxRef.current) {
      setBoxWidth(boxRef.current.offsetWidth)
    }
  }, [boxRef])

  React.useEffect(() => {
    return window.addEventListener('resize', () => {
      if (boxRef.current) {
        setBoxWidth(boxRef.current.offsetWidth)
      }
    })
  }, [])

  const alt = `profile picture of ${formatName(name)}`
  return (
    <Box>
      <Box
        ref={boxRef}
        borderRadius="50%"
        width="100%"
        pb="100%"
        role="img"
        bg={!profilePicUrl ? colors.africanElephant : undefined}
        position="relative"
      >
        {profilePicUrl && (
          <Image
            src={profilePicUrl}
            alt={alt}
            position="absolute"
            backgroundPosition="center"
            backgroundSize="cover"
            borderRadius="50%"
            width="100%"
            height="100%"
            objectFit="cover"
            objectPosition="50% 50%"
          />
        )}
        {!profilePicUrl && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <Text.Plain
              fontWeight={500}
              fontSize={boxWidth / 2.5}
              color={colors.white}
              userSelect="none"
            >
              {getInitials(name)}
            </Text.Plain>
          </Box>
        )}
      </Box>
      {cardImage && (
        <Image
          position="absolute"
          {...{
            vertical: {
              width: '25%',
              bottom: 0,
              right: 0,
              transform: 'rotateZ(15deg)',
            },
            horizontal: {
              width: '50%',
              bottom: '-5%',
              right: '-5%',
              transform: 'rotateZ(-15deg)',
            },
            unknown: {},
          }[businessCardOrientation]}
          src={cardImage}
          boxShadow="businessCard"
          alt={`front of ${formatName(name)}'s Nomus card`}
        />
      )}
    </Box>
  )
}

export default ProfilePicture
