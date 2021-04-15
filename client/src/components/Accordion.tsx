import * as React from 'react'
import Box from './Box'
import * as Text from './Text'
import { colors } from 'src/styles'
import {
  Accordion as ChakraAccordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/react'
import Icon from './Icon'

interface Props {
  title: string
  children: React.ReactNode
}

const Accordion = ({ title, children }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const handleButtonClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <ChakraAccordion allowMultiple allowToggle>
      <AccordionItem>
        <AccordionButton onClick={handleButtonClick}>
          <Box flex="1" textAlign="left">
            <Text.SectionSubheader>{title}</Text.SectionSubheader>
          </Box>
          {isOpen ? (
            <Icon of="minus" color={colors.africanElephant} />
          ) : (
            <Icon of="plus" color={colors.africanElephant} />
          )}
        </AccordionButton>
        <AccordionPanel>{children}</AccordionPanel>
      </AccordionItem>
    </ChakraAccordion>
  )
}

export default Accordion
