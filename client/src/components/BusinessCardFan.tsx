import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import { getImageDimensions, ImageDimensions } from 'src/utils/image'

interface Props {
  frontImageUrl: string
  backImageUrl: string
}

const BusinessCardFan = ({ frontImageUrl, backImageUrl }: Props) => {
  const [businessCardDimensions, setBusinessCardDimensions] = React.useState<
    ImageDimensions | 'determining' | null
  >(null)
  React.useEffect(() => {
    if (businessCardDimensions == null) {
      setBusinessCardDimensions('determining')
      getImageDimensions(frontImageUrl).then(setBusinessCardDimensions)
    }
  }, [frontImageUrl, businessCardDimensions])

  const cardOrientation = React.useMemo(() => {
    if (
      businessCardDimensions == null ||
      businessCardDimensions === 'determining'
    ) {
      return 'unknown'
    }
    return businessCardDimensions.height > businessCardDimensions.width
      ? 'vertical'
      : 'horizontal'
  }, [businessCardDimensions])

  return (
    <Box
      position="relative"
      visibility={cardOrientation === 'unknown' ? 'hidden' : 'visible'}
      pt={
        { vertical: '10%', horizontal: '21%', unknown: '0%' }[cardOrientation]
      }
    >
      {frontImageUrl && (
        <Image
          zIndex={2}
          position="relative"
          width={
            { horizontal: '80%', vertical: '50%', unknown: '50%' }[
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
          transform="rotateZ(-12.67deg)"
          {...{
            vertical: {
              width: '50%',
              bottom: '5%',
              right: '35%',
            },
            horizontal: {
              width: '80%',
              right: '15%',
              bottom: '18%',
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
