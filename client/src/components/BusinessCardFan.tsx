import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import businessCardFrontFallback from 'src/images/business-card-front-fallback.svg'
import businessCardBackFallback from 'src/images/business-card-back-fallback.svg'
import { useImageOrientation } from 'src/utils/image'

interface Props {
  frontImageUrl?: string | null
  backImageUrl?: string | null
}

const BusinessCardFan = ({ frontImageUrl, backImageUrl }: Props) => {
  const showPlaceholder = !frontImageUrl && !backImageUrl
  const frontImageOrientation = useImageOrientation(frontImageUrl ?? null)
  const cardOrientation = showPlaceholder ? 'horizontal' : frontImageOrientation

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
      {
        <Image
          zIndex={2}
          position="relative"
          width={
            { horizontal: '90%', vertical: '50%', unknown: '50%' }[
              cardOrientation
            ]
          }
          ml="auto"
          src={frontImageUrl ?? businessCardFrontFallback}
          boxShadow="businessCard"
          draggable="false"
        />
      }
      {
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
          src={backImageUrl ?? businessCardBackFallback}
          boxShadow="businessCard"
          draggable="false"
        />
      }
    </Box>
  )
}

export default BusinessCardFan
