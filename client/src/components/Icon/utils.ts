import { createIcon as createChakraIcon } from '@chakra-ui/icons'
import { colors } from 'src/styles'

type CreateIconProps = Parameters<typeof createChakraIcon>[0]

// A custom createIcon that applies our custom defaultProps
export const createIcon = ({ defaultProps, ...restOfProps }: CreateIconProps) =>
  createChakraIcon({
    defaultProps: {
      boxSize: '24px',
      color: colors.midnightGray,
      ...(defaultProps ?? {}),
    },
    ...restOfProps,
  })
