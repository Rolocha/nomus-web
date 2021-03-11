import * as React from 'react'
import { colors } from 'src/styles'
import Box from './Box'
import * as Text from './Text'
import Icon from './Icon'

interface Props {
  title: string
  children: React.ReactNode
  size?: 'medium' | 'small'
}

const Accordion = ({ title, children, size = 'medium' }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleButtonClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Box>
      <Box
        borderTop={`1px solid ${colors.africanElephant}`}
        borderBottom={
          !isOpen ? `1px solid ${colors.africanElephant}` : undefined
        }
        height={
          {
            medium: '64px',
            small: '42px',
          }[size]
        }
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text.SectionSubheader>{title}</Text.SectionSubheader>
        <Box role="button" cursor="pointer" onClick={handleButtonClick}>
          {isOpen ? (
            <Icon of="minus" color={colors.midnightGray} />
          ) : (
            <Icon of="plus" color={colors.midnightGray} />
          )}
        </Box>
      </Box>

      {isOpen && (
        <Box borderBottom={`1px solid ${colors.africanElephant}`} pb="20px">
          {children}
        </Box>
      )}
    </Box>
  )
}

export default Accordion
