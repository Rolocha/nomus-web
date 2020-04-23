import * as React from 'react'
import Box from 'components/Box'
import Spinner from 'components/Spinner'

interface Props {
  className?: string
}

export default ({ className }: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
      className={className}
    >
      <Spinner />
    </Box>
  )
}
