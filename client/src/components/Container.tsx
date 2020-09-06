import * as React from 'react'
import Box from 'src/components/Box'

interface Props extends React.ComponentProps<typeof Box> {
  children: any
}

const Container = ({ children, ...props }: Props) => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={{ _: 3, lg: 0 }}
    >
      <Box maxWidth="1250px" {...props}>
        {children}
      </Box>
    </Box>
  )
}

export default Container
