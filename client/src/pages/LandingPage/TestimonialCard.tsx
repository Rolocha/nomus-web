import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'

interface Props {
  quote: string
  authorName: string
  authorImageSrc: string
  authorHeadline: string
}

const TestimonialCard = ({
  quote,
  authorName,
  authorImageSrc,
  authorHeadline,
}: Props) => (
  <Box
    p="16px"
    bg={colors.white}
    borderRadius="8px"
    boxShadow="businessCard"
    display="flex"
    flexDirection="column"
    alignItems="center"
  >
    <Image
      src={authorImageSrc}
      borderRadius="100%"
      w="75px"
      h="75px"
      textAlign="center"
      mb="16px"
    />
    <Text.Body textAlign="center" mb="16px">
      {quote}
    </Text.Body>
    <Text.Body textAlign="center" fontWeight="bold" color={colors.nomusBlue}>
      {authorName}
    </Text.Body>
    <Text.Body textAlign="center">{authorHeadline}</Text.Body>
  </Box>
)
export default TestimonialCard
