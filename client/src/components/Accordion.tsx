import * as React from 'react'
import Box from './Box'
import * as Text from './Text'
import {
  Accordion as ChakraAccordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

interface Props {
  title: string
  children: React.ReactNode
}

const Accordion = ({ title, children }: Props) => {
  return (
    <ChakraAccordion allowMultiple allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Text.SectionSubheader>{title}</Text.SectionSubheader>
          </Box>
          <AccordionIcon justifySelf="right" />
        </AccordionButton>
        <AccordionPanel>{children}</AccordionPanel>
      </AccordionItem>
    </ChakraAccordion>
  )
}

export default Accordion
