import * as React from 'react'
import Box from 'src/components/Box'
import Icon from 'src/components/Icon'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { useBreakpoint } from 'src/styles/breakpoints'

interface TestimonialInfo {
  quote: string
  authorName: string
  authorImageSrc: string
  authorHeadline: string
}

interface Props {
  testimonials: TestimonialInfo[]
  backgroundColor?: string
}

const TestimonialCarousel = ({ backgroundColor, testimonials }: Props) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const wrapperBoxRef = React.useRef<HTMLDivElement | null>(null)
  const cardRefs = React.useRef<HTMLDivElement[]>([])
  const isDesktop = useBreakpoint('lg')

  React.useEffect(() => {
    const selectedCard = cardRefs.current[selectedIndex]
    const cardWidth = selectedCard.clientWidth
    const totalSpaceWidth = wrapperBoxRef.current?.clientWidth!
    const leftPad = (totalSpaceWidth - cardWidth) / 2

    if (selectedCard) {
      wrapperBoxRef.current?.scrollTo({
        left: selectedCard.offsetLeft - leftPad,
        behavior: 'smooth',
      })
    }
  }, [selectedIndex])

  const goToPreviousCard = React.useCallback(() => {
    if (selectedIndex <= 0) return
    setSelectedIndex(selectedIndex - 1)
  }, [setSelectedIndex, selectedIndex])

  const goToNextCard = React.useCallback(() => {
    if (selectedIndex >= testimonials.length) return
    setSelectedIndex(selectedIndex + 1)
  }, [setSelectedIndex, selectedIndex, testimonials.length])

  return (
    <Box
      ref={wrapperBoxRef}
      p="24px"
      bg={backgroundColor}
      // Hidden because we manually handle scrolling with the buttons
      overflowX="hidden"
      display="flex"
      alignItems="center"
      position="relative"
    >
      {testimonials.map(
        ({ authorName, authorHeadline, authorImageSrc, quote }, index) => (
          <Box
            key={quote}
            ref={(el) => {
              if (el) {
                cardRefs.current[index] = el
              }
            }}
            display="flex"
            alignItems="center"
            // For now, we only support arrow-pagination on mobile
            // On desktop, cards get auto-sized such that all of them
            // fit within the container
            width={{ base: '100%', lg: 'auto' }}
            flexShrink={{ base: 0, lg: 1 }}
            flexGrow={1}
            mr={index !== testimonials.length - 1 ? '16px' : undefined}
            p="24px"
            bg={colors.white}
            borderRadius="8px"
            boxShadow="card"
          >
            {!isDesktop && (
              <Icon
                of="arrowRightO"
                color={colors.nomusBlue}
                cursor="pointer"
                visibility={index === 0 ? 'hidden' : 'visible'}
                transform="rotateZ(180deg)"
                role="button"
                onClick={goToPreviousCard}
              />
            )}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mx={3}
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
              <Text.Body
                textAlign="center"
                fontWeight="bold"
                color={colors.nomusBlue}
              >
                {authorName}
              </Text.Body>
              <Text.Body textAlign="center">{authorHeadline}</Text.Body>
            </Box>
            {!isDesktop && (
              <Icon
                of="arrowRightO"
                color={colors.nomusBlue}
                cursor="pointer"
                visibility={
                  index === testimonials.length - 1 ? 'hidden' : 'visible'
                }
                onClick={goToNextCard}
              />
            )}
          </Box>
        ),
      )}
    </Box>
  )
}
export default TestimonialCarousel
