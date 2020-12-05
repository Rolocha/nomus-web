import { css } from '@emotion/core'
import * as React from 'react'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { IName, formatName, getInitials } from 'src/utils/name'
import Box from './Box'

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
      alt={alt}
      bg={!profilePicUrl ? colors.africanElephant : undefined}
      position="relative"
    >
      {profilePicUrl && (
        <Box
          role="img"
          position="absolute"
          top="50%"
          left="50%"
          background={`url(${profilePicUrl}) 50% 50% no-repeat`}
          css={css({
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            transform: 'translate(-50%, -50%)',
          })}
          borderRadius="50%"
          width="100%"
          height="100%"
          alt={alt}
        />
      )}
      {!profilePicUrl && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          css={css({
            transform: 'translate(-50%, -50%)',
          })}
        >
          <Text.Plain
            fontWeight={500}
            fontSize={boxWidth / 2.5}
            color={colors.white}
            css={css({ userSelect: 'none' })}
          >
            {getInitials(name)}
          </Text.Plain>
        </Box>
      )}
    </Box>
  )
}

export default ProfilePicture
