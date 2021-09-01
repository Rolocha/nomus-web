import Icon from 'src/components/Icon'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'

const NomusProBadge = () => {
  const textColor = colors.midnightGray
  const borderColor = colors.gold
  const bgColor = colors.gold
  const fontSize = 12

  return (
    <Text.Plain
      as="span"
      bg={bgColor}
      border={`1px solid ${borderColor}`}
      color={textColor}
      p="4px"
      borderRadius="4px"
      fontSize={`${fontSize}px`}
      display="inline-flex"
      alignItems="center"
      userSelect="none"
    >
      <Icon
        of="nomusPro"
        color={textColor}
        boxSize={`${fontSize * (4 / 3)}px`}
      />
      <Box as="span" ml="4px">
        Nomus Pro
      </Box>
    </Text.Plain>
  )
}

export default NomusProBadge
