import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import { useImageOrientation } from 'src/utils/image'

interface Props {
  frontImageUrl?: string | null
  backImageUrl?: string | null
}

const BusinessCardFan = ({ frontImageUrl, backImageUrl }: Props) => {
  const cardOrientation = useImageOrientation(frontImageUrl ?? null)

  return (
    <Box
      position="relative"
      height="100%"
      visibility={cardOrientation === 'unknown' ? 'hidden' : 'visible'}
      {...{
        vertical: {
          pt: '10%',
          mb: '5%',
        },
        horizontal: {
          pt: '43%',
        },
        unknown: {},
      }[cardOrientation]}
    >
      {frontImageUrl && (
        <Image
          zIndex={2}
          // maxHeight="100%"
          position="relative"
          width={
            { horizontal: '90%', vertical: '50%', unknown: '50%' }[
              cardOrientation
            ]
          }
          ml="auto"
          src={frontImageUrl}
          boxShadow="businessCard"
        />
      )}
      {backImageUrl && (
        <Image
          zIndex={1}
          position="absolute"
          maxHeight="100%"
          {...{
            vertical: {
              transform: 'rotateZ(-12.67deg)',
              width: '50%',
              bottom: '5%',
              right: '35%',
            },
            horizontal: {
              transform: 'rotateZ(-8deg)',
              width: '90%',
              right: '6%',
              bottom: '34%',
            },
            unknown: {},
          }[cardOrientation]}
          src={backImageUrl}
          boxShadow="businessCard"
        />
      )}
    </Box>
  )
}

export default BusinessCardFan
