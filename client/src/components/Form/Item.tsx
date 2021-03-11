import { PropsOf } from '@chakra-ui/react'
import * as React from 'react'
import Box from 'src/components/Box'

interface Props extends PropsOf<typeof Box> {
  children: React.ReactNode
}

const Item = ({ children, ...boxProps }: Props) => (
  <Box display="flex" flexDirection="column" {...boxProps}>
    {children}
  </Box>
)

export default Item
