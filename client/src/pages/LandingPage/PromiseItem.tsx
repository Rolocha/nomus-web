import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'

interface PromiseItemProps {
  title: string
  description: string
  imageSrc: string
}

const PromiseItem = ({ title, description, imageSrc }: PromiseItemProps) => (
  <Box>
    <Image src={imageSrc} />
    <Text.Body fontWeight="bold">{title}</Text.Body>
    <Text.Body>{description}</Text.Body>
  </Box>
)

export default PromiseItem
