import * as React from 'react'
import { colors } from 'src/styles'
import Box from './Box'
import * as Text from './Text'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

interface Props {
  title: string
  children: React.ReactNode
}

const AccordionComponent = ({ title, children }: Props) => {
  return (
    <Accordion allowMultiple allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Text.SectionSubheader>{title}</Text.SectionSubheader>
          </Box>
          <AccordionIcon justifySelf="right" />
        </AccordionButton>
        <AccordionPanel>
          <Box borderBottom={`1px solid ${colors.africanElephant}`} pb="20px">
            {children}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default AccordionComponent
