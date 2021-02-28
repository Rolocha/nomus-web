import * as React from 'react'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { formatName, getInitials, IName } from 'src/utils/name'
import Box from './Box'
import Image from './Image'

interface Props {
  name: IName
  profilePicUrl?: string | null
}

const ProfilePicture = ({ name, profilePicUrl }: Props) => {
  const boxRef = React.useRef<HTMLDivElement>(null)
  const [boxWidth, setBoxWidth] = React.useState(0)

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
  )
}

export default ProfilePicture
