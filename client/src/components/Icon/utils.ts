import { createIcon as createChakraIcon } from '@chakra-ui/icons'

type CreateIconProps = Parameters<typeof createChakraIcon>[0]

// A custom createIcon that applies our custom defaultProps
export const createIcon = (props: CreateIconProps) =>
  createChakraIcon({
    defaultProps: {
      boxSize: '24px',
      ...(props.defaultProps ?? {}),
    },
    ...props,
  })
