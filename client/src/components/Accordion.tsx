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
  size?: 'medium' | 'small'
}

const AccordionComponent = ({ title, children, size = 'medium' }: Props) => {
  // const [isOpen, setIsOpen] = React.useState(false)

  // const handleButtonClick = () => {
  //   setIsOpen(!isOpen)
  // }

  return (
    <Accordion allowMultiple allowToggle>
      <AccordionItem>
        <Box
          // borderTop={`1px solid ${colors.africanElephant}`}
          // borderBottom={!isOpen ? `1px solid ${colors.afrdockicanElephant}` : null}
          // height={
          //   {
          //     medium: '64px',
          //     small: '42px',
          //   }[size]
          // }
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <AccordionButton>
            <Text.SectionSubheader>{title}</Text.SectionSubheader>
            <AccordionIcon />
          </AccordionButton>
          {/* <Box role="button" cursor="pointer" onClick={handleButtonClick}>
          {isOpen ? (
            <Icon of="minus" color={colors.midnightGray} />
          ) : (
            <Icon of="plus" color={colors.midnightGray} />
          )}
        </Box> */}
        </Box>
      </AccordionItem>

      {/* {isOpen && ( */}
      <AccordionPanel>
        <Box borderBottom={`1px solid ${colors.africanElephant}`} pb="20px">
          {children}
        </Box>
      </AccordionPanel>
      {/* )} */}
    </Accordion>
  )
}

export default AccordionComponent
