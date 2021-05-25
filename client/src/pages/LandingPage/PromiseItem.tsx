import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'

interface PromiseItemProps {
  title: string
  description: string
  imageSrc: string
}

const PromiseItem = ({ title, description, imageSrc }: PromiseItemProps) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <Image src={imageSrc} px="16px" pb="8px" />
    <Text.Body textAlign="center" fontWeight="bold">
      {title}
    </Text.Body>
    <Text.Body textAlign="center">{description}</Text.Body>
  </Box>
)

export default PromiseItem
