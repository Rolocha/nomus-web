import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import crewImageOverlay from './images/crew-image-overlay.svg'

interface Props {
  name: string
  title: string
  imageSrc: string
}

const CrewMemberCell = ({ name, title, imageSrc }: Props) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box position="relative" mb="16px">
      <Image src={imageSrc} borderRadius="100%" />
      <Image
        src={crewImageOverlay}
        position="absolute"
        top="-2%"
        right="-2%"
        width="104%"
        height="104%"
      />
    </Box>
    <Text.Body fontWeight="bold">{name}</Text.Body>
    <Text.Body>{title}</Text.Body>
  </Box>
)

export default CrewMemberCell
